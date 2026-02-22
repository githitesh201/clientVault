#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

log() {
  printf "\n[bootstrap] %s\n" "$1"
}

warn() {
  printf "\n[bootstrap][warn] %s\n" "$1"
}

err() {
  printf "\n[bootstrap][error] %s\n" "$1" >&2
}

detect_package_manager() {
  if command -v apt-get >/dev/null 2>&1; then
    echo "apt-get"
    return
  fi
  if command -v dnf >/dev/null 2>&1; then
    echo "dnf"
    return
  fi
  if command -v pacman >/dev/null 2>&1; then
    echo "pacman"
    return
  fi
  if command -v zypper >/dev/null 2>&1; then
    echo "zypper"
    return
  fi
  if command -v brew >/dev/null 2>&1; then
    echo "brew"
    return
  fi

  echo ""
}

install_with_package_manager() {
  local manager="$1"
  shift
  local pkgs=("$@")

  case "$manager" in
    apt-get)
      sudo apt-get update
      sudo apt-get install -y "${pkgs[@]}"
      ;;
    dnf)
      sudo dnf install -y "${pkgs[@]}"
      ;;
    pacman)
      sudo pacman -Sy --noconfirm "${pkgs[@]}"
      ;;
    zypper)
      sudo zypper --non-interactive install "${pkgs[@]}"
      ;;
    brew)
      brew install "${pkgs[@]}"
      ;;
    *)
      return 1
      ;;
  esac
}

find_pg_bindir() {
  if command -v pg_ctl >/dev/null 2>&1; then
    command -v pg_ctl >/dev/null 2>&1
    return
  fi

  local candidate=""
  candidate="$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -n 1 || true)"
  if [[ -n "$candidate" ]]; then
    export PATH="$candidate:$PATH"
  fi
}

require_cmd() {
  local cmd="$1"
  local manager="$2"
  shift 2
  local pkgs=("$@")

  if command -v "$cmd" >/dev/null 2>&1; then
    return
  fi

  if [[ -z "$manager" ]]; then
    err "Missing required command '$cmd' and no supported package manager found."
    exit 1
  fi

  log "Installing missing dependency '$cmd' via $manager..."
  install_with_package_manager "$manager" "${pkgs[@]}"

  if ! command -v "$cmd" >/dev/null 2>&1; then
    err "Command '$cmd' is still missing after installation."
    exit 1
  fi
}

ensure_node_and_yarn() {
  local manager="$1"

  if ! command -v node >/dev/null 2>&1; then
    case "$manager" in
      apt-get) require_cmd node "$manager" nodejs npm ;;
      dnf) require_cmd node "$manager" nodejs npm ;;
      pacman) require_cmd node "$manager" nodejs npm ;;
      zypper) require_cmd node "$manager" nodejs npm ;;
      brew) require_cmd node "$manager" node ;;
      *)
        err "Node.js is required but not installed."
        exit 1
        ;;
    esac
  fi

  if [[ -f ".nvmrc" ]]; then
    local required_major
    local current_major
    required_major="$(tr -d '[:space:]' < .nvmrc | sed 's/^v//; s/\..*//')"
    current_major="$(node -p 'process.versions.node.split(".")[0]')"
    if [[ "$current_major" -lt "$required_major" ]]; then
      warn "Node $(node -v) detected, but .nvmrc expects major $required_major. Continuing anyway."
    fi
  fi

  if ! command -v corepack >/dev/null 2>&1; then
    log "Installing Corepack..."
    npm install -g corepack
  fi

  log "Enabling Corepack and activating Yarn 4.9.2..."
  corepack enable
  corepack prepare yarn@4.9.2 --activate
}

upsert_env_value() {
  local file="$1"
  local key="$2"
  local value="$3"

  if grep -q "^${key}=" "$file"; then
    if [[ "$(uname -s)" == "Darwin" ]]; then
      sed -i '' "s|^${key}=.*|${key}=${value}|" "$file"
    else
      sed -i "s|^${key}=.*|${key}=${value}|" "$file"
    fi
  else
    printf "\n%s=%s\n" "$key" "$value" >>"$file"
  fi
}

ensure_env_files() {
  if [[ ! -f packages/clientvault-front/.env ]]; then
    cp packages/clientvault-front/.env.example packages/clientvault-front/.env
  fi

  if [[ ! -f packages/clientvault-server/.env ]]; then
    cp packages/clientvault-server/.env.example packages/clientvault-server/.env
  fi

  upsert_env_value "packages/clientvault-server/.env" "PG_DATABASE_URL" "postgres://postgres:postgres@localhost:5433/default"
  upsert_env_value "packages/clientvault-server/.env" "REDIS_URL" "redis://localhost:6379"
}

ensure_postgres() {
  local manager="$1"

  find_pg_bindir
  if ! command -v pg_ctl >/dev/null 2>&1 || ! command -v initdb >/dev/null 2>&1 || ! command -v psql >/dev/null 2>&1; then
    case "$manager" in
      apt-get) install_with_package_manager "$manager" postgresql postgresql-client ;;
      dnf) install_with_package_manager "$manager" postgresql-server postgresql ;;
      pacman) install_with_package_manager "$manager" postgresql ;;
      zypper) install_with_package_manager "$manager" postgresql-server postgresql ;;
      brew) install_with_package_manager "$manager" postgresql@17 ;;
      *)
        err "PostgreSQL tools are required (pg_ctl/initdb/psql)."
        exit 1
        ;;
    esac
    find_pg_bindir
  fi

  if ! command -v pg_ctl >/dev/null 2>&1 || ! command -v initdb >/dev/null 2>&1 || ! command -v psql >/dev/null 2>&1; then
    err "PostgreSQL binaries are still missing from PATH."
    exit 1
  fi

  if pg_isready -h 127.0.0.1 -p 5433 >/dev/null 2>&1; then
    log "PostgreSQL is already running on port 5433."
  else
    mkdir -p .pgdata
    if [[ ! -f .pgdata/PG_VERSION ]]; then
      log "Initializing local PostgreSQL data directory (.pgdata)..."
      initdb -D .pgdata -U postgres -A trust >/dev/null
    fi

    rm -f .pgdata/.s.PGSQL.5433 .pgdata/.s.PGSQL.5433.lock
    log "Starting local PostgreSQL on port 5433..."
    pg_ctl -D .pgdata -l .pgdata/postgres.log -o "-p 5433 -k $ROOT_DIR/.pgdata" start
  fi

  log "Ensuring application databases exist (default/test)..."
  psql -h 127.0.0.1 -p 5433 -U postgres -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='default'" | grep -q 1 || \
    psql -h 127.0.0.1 -p 5433 -U postgres -d postgres -c 'CREATE DATABASE "default";'
  psql -h 127.0.0.1 -p 5433 -U postgres -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='test'" | grep -q 1 || \
    psql -h 127.0.0.1 -p 5433 -U postgres -d postgres -c 'CREATE DATABASE "test";'
}

ensure_redis() {
  local manager="$1"

  if ! command -v redis-server >/dev/null 2>&1 || ! command -v redis-cli >/dev/null 2>&1; then
    case "$manager" in
      apt-get) install_with_package_manager "$manager" redis-server ;;
      dnf) install_with_package_manager "$manager" redis ;;
      pacman) install_with_package_manager "$manager" redis ;;
      zypper) install_with_package_manager "$manager" redis ;;
      brew) install_with_package_manager "$manager" redis ;;
      *)
        err "Redis is required but redis-server/redis-cli are missing."
        exit 1
        ;;
    esac
  fi

  if redis-cli -h 127.0.0.1 -p 6379 ping >/dev/null 2>&1; then
    log "Redis is already running on port 6379."
  else
    log "Starting Redis on port 6379..."
    redis-server --daemonize yes --save "" --appendonly no
    sleep 1
    redis-cli -h 127.0.0.1 -p 6379 ping >/dev/null
  fi
}

main() {
  log "Bootstrapping ClientVault from a fresh clone..."

  local manager
  manager="$(detect_package_manager)"
  if [[ -z "$manager" ]]; then
    warn "No supported package manager found. Automatic OS package install may fail."
  else
    log "Detected package manager: $manager"
  fi

  ensure_node_and_yarn "$manager"

  log "Installing JS dependencies..."
  corepack yarn install

  ensure_env_files
  ensure_postgres "$manager"
  ensure_redis "$manager"

  log "Starting ClientVault (backend + frontend + worker)..."
  log "Frontend: http://localhost:3001"
  log "Backend:  http://localhost:3000/healthz"
  log "If your machine has file watcher limits, run with CHOKIDAR_USEPOLLING=true."

  export NX_DAEMON=false
  exec corepack yarn start
}

main "$@"
