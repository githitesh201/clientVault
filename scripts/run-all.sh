#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

log() {
  printf "\n[run-all] %s\n" "$1"
}

err() {
  printf "\n[run-all][error] %s\n" "$1" >&2
}

ensure_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    err "Required command '$cmd' is missing. Install it first."
    exit 1
  fi
}

find_pg_bin() {
  if command -v pg_ctl >/dev/null 2>&1; then
    return
  fi

  local candidate
  candidate="$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -n 1 || true)"
  if [[ -n "$candidate" ]]; then
    export PATH="$candidate:$PATH"
  fi
}

ensure_env_files() {
  [[ -f packages/clientvault-front/.env ]] || cp packages/clientvault-front/.env.example packages/clientvault-front/.env
  [[ -f packages/clientvault-server/.env ]] || cp packages/clientvault-server/.env.example packages/clientvault-server/.env

  if grep -q '^PG_DATABASE_URL=' packages/clientvault-server/.env; then
    sed -i 's|^PG_DATABASE_URL=.*|PG_DATABASE_URL=postgres://postgres:postgres@localhost:5433/default|' packages/clientvault-server/.env
  else
    printf '\nPG_DATABASE_URL=postgres://postgres:postgres@localhost:5433/default\n' >> packages/clientvault-server/.env
  fi

  if grep -q '^REDIS_URL=' packages/clientvault-server/.env; then
    sed -i 's|^REDIS_URL=.*|REDIS_URL=redis://localhost:6379|' packages/clientvault-server/.env
  else
    printf '\nREDIS_URL=redis://localhost:6379\n' >> packages/clientvault-server/.env
  fi
}

start_postgres() {
  if [[ -f .pgdata/PG_VERSION ]] && pg_ctl -D .pgdata status >/dev/null 2>&1; then
    log "Postgres already running from .pgdata."
    return
  fi

  mkdir -p .pgdata
  if [[ ! -f .pgdata/PG_VERSION ]]; then
    log "Initializing local Postgres data directory (.pgdata)..."
    initdb -D .pgdata -U postgres -A trust >/dev/null
  fi

  rm -f .pgdata/.s.PGSQL.5433 .pgdata/.s.PGSQL.5433.lock
  log "Starting local Postgres on 5433..."
  if ! pg_ctl -D .pgdata -l .pgdata/postgres.log -o "-p 5433 -k $ROOT_DIR/.pgdata" start; then
    if pg_ctl -D .pgdata status >/dev/null 2>&1; then
      log "Postgres was already running; continuing."
    else
      err "Postgres failed to start. Check .pgdata/postgres.log"
      exit 1
    fi
  fi

  psql -h "$ROOT_DIR/.pgdata" -p 5433 -U postgres -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='default'" | grep -q 1 || \
    psql -h "$ROOT_DIR/.pgdata" -p 5433 -U postgres -d postgres -c 'CREATE DATABASE "default";'
  psql -h "$ROOT_DIR/.pgdata" -p 5433 -U postgres -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='test'" | grep -q 1 || \
    psql -h "$ROOT_DIR/.pgdata" -p 5433 -U postgres -d postgres -c 'CREATE DATABASE "test";'
}

start_redis() {
  if redis-cli -h 127.0.0.1 -p 6379 ping >/dev/null 2>&1; then
    log "Redis already running on 6379."
    return
  fi

  log "Starting Redis on 6379..."
  redis-server --daemonize yes --save "" --appendonly no
  sleep 1
  redis-cli -h 127.0.0.1 -p 6379 ping >/dev/null
}

stop_existing_app_processes() {
  log "Stopping existing ClientVault app processes (if any)..."
  pkill -f "nx run clientvault-server:start:ci" >/dev/null 2>&1 || true
  pkill -f "nx run clientvault-server:worker" >/dev/null 2>&1 || true
  pkill -f "nx run clientvault-front:start" >/dev/null 2>&1 || true
  pkill -f "NODE_ENV=development nest start" >/dev/null 2>&1 || true
  pkill -f "wait-on tcp:3000" >/dev/null 2>&1 || true
  pkill -f "dist/queue-worker/queue-worker.js" >/dev/null 2>&1 || true
  pkill -f "packages/clientvault-server/dist/main" >/dev/null 2>&1 || true
  sleep 2
}

clear_frontend_cache() {
  log "Clearing frontend Vite cache..."
  rm -rf node_modules/.vite/packages/clientvault-front
  rm -rf packages/clientvault-front/node_modules/.vite
}

main() {
  find_pg_bin
  ensure_cmd node
  ensure_cmd npx
  ensure_cmd pg_ctl
  ensure_cmd initdb
  ensure_cmd psql
  ensure_cmd pg_isready
  ensure_cmd redis-server
  ensure_cmd redis-cli

  stop_existing_app_processes
  clear_frontend_cache
  ensure_env_files
  start_postgres
  start_redis

  log "Prebuilding server artifacts for worker..."
  npx nx run clientvault-server:build

  log "Starting backend + frontend + worker..."
  log "Frontend: http://localhost:3001"
  log "Backend:  http://localhost:3000/healthz"

  export CHOKIDAR_USEPOLLING="${CHOKIDAR_USEPOLLING:-true}"
  export NX_DAEMON=false

  exec npx concurrently --kill-others \
    "cd packages/clientvault-server && NODE_ENV=development node dist/main" \
    "npx nx run clientvault-front:start" \
    "npx wait-on tcp:3000 && cd packages/clientvault-server && NODE_ENV=development node dist/queue-worker/queue-worker.js"
}

main "$@"
