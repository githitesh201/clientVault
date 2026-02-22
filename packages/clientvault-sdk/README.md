<div align="center">
  <a href="https://clientvault.com">
    <picture>
      <img alt="ClientVault logo" src="https://raw.githubusercontent.com/clientvaulthq/clientvault/2f25922f4cd5bd61e1427c57c4f8ea224e1d552c/packages/clientvault-website/public/images/core/logo.svg" height="128">
    </picture>
  </a>
  <h1>ClientVault SDK</h1>

<a href="https://www.npmjs.com/package/clientvault-sdk"><img alt="NPM version" src="https://img.shields.io/npm/v/clientvault-sdk.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/clientvaulthq/clientvault/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://discord.gg/cx5n4Jzs57"><img alt="Join the community on Discord" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&logo=ClientVault&labelColor=000000&logoWidth=20"></a>

</div>

A CLI and SDK to develop, build, and publish applications that extend [ClientVault CRM](https://clientvault.com).

- Type‑safe client and workspace entity typings
- Built‑in CLI for auth, dev mode (watch & sync), uninstall, and function management
- Works great with the scaffolder: [create-clientvault-app](https://www.npmjs.com/package/create-clientvault-app)

## Documentation
See ClientVault application documentation https://docs.clientvault.com/developers/extend/capabilities/apps

## Prerequisites
- Node.js 24+ (recommended) and Yarn 4
- A ClientVault workspace and an API key. Generate one at https://app.clientvault.com/settings/api-webhooks

## Installation

```bash
npm install clientvault-sdk
# or
yarn add clientvault-sdk
```

## Usage

```
Usage: clientvault [options] [command]

CLI for ClientVault application development

Options:
  --workspace <name>   Use a specific workspace configuration (default: "default")
  -V, --version        output the version number
  -h, --help           display help for command

Commands:
  auth:login           Authenticate with ClientVault
  auth:logout          Remove authentication credentials
  auth:status          Check authentication status
  auth:switch          Switch the default workspace
  auth:list            List all configured workspaces
  app:dev              Watch and sync local application changes
  app:uninstall        Uninstall application from ClientVault
  entity:add           Add a new entity to your application
  function:logs        Watch application function logs
  function:execute     Execute a logic function with a JSON payload
  help [command]       display help for command
```

In a scaffolded project (via `create-clientvault-app`), use `yarn clientvault <command>` instead of calling `clientvault` directly. For example: `yarn clientvault help`, `yarn clientvault app:dev`, etc.

## Global Options

- `--workspace <name>`: Use a specific workspace configuration profile. Defaults to `default`. See Configuration for details.

## Commands

### Auth

Authenticate the CLI against your ClientVault workspace.

- `clientvault auth:login` — Authenticate with ClientVault.
  - Options:
    - `--api-key <key>`: API key for authentication.
    - `--api-url <url>`: ClientVault API URL (defaults to your current profile's value or `http://localhost:3000`).
  - Behavior: Prompts for any missing values, persists them to the active workspace profile, and validates the credentials.

- `clientvault auth:logout` — Remove authentication credentials for the active workspace profile.

- `clientvault auth:status` — Print the current authentication status (API URL, masked API key, validity).

- `clientvault auth:list` — List all configured workspaces.
  - Behavior: Displays all available workspaces with their authentication status and API URLs. Shows which workspace is the current default.

- `clientvault auth:switch [workspace]` — Switch the default workspace for authentication.
  - Arguments:
    - `workspace` (optional): Name of the workspace to switch to. If omitted, shows an interactive selection.
  - Behavior: Sets the specified workspace as the default, so subsequent commands use it without needing `--workspace`.

Examples:

```bash
# Login interactively (recommended)
clientvault auth:login

# Provide values in flags
clientvault auth:login --api-key $CLIENTVAULT_API_KEY --api-url https://api.clientvault.com

# Login interactively for a specific workspace profile
clientvault auth:login --workspace my-custom-workspace

# Check status
clientvault auth:status

# Logout current profile
clientvault auth:logout

# List all configured workspaces
clientvault auth:list

# Switch default workspace interactively
clientvault auth:switch

# Switch to a specific workspace
clientvault auth:switch production
```

### App

Application development commands.

- `clientvault app:dev [appPath]` — Start development mode: watch and sync local application changes.
  - Behavior: Builds your application (functions and front components), computes the manifest, syncs everything to your workspace, then watches the directory for changes and re-syncs automatically. Displays an interactive UI showing build and sync status in real time. Press Ctrl+C to stop.

- `clientvault app:uninstall [appPath]` — Uninstall the application from the current workspace.

### Entity

- `clientvault entity:add [entityType]` — Add a new entity to your application.
  - Arguments:
    - `entityType`: one of `object`, `field`, `function`, `front-component`, `role`, `view`, or `navigation-menu-item`. If omitted, an interactive prompt is shown.
  - Options:
    - `--path <path>`: The path where the entity file should be created (relative to the current directory).
  - Behavior:
    - `object`: prompts for singular/plural names and labels, then creates a `*.object.ts` definition file.
    - `field`: prompts for name, label, type, and target object, then creates a `*.field.ts` definition file.
    - `function`: prompts for a name and scaffolds a `*.function.ts` logic function file.
    - `front-component`: prompts for a name and scaffolds a `*.front-component.tsx` file.
    - `role`: prompts for a name and scaffolds a `*.role.ts` role definition file.
    - `view`: prompts for a name and target object, then creates a `*.view.ts` definition file.
    - `navigation-menu-item`: prompts for a name and scaffolds a `*.navigation-menu-item.ts` file.

### Function

- `clientvault function:logs [appPath]` — Stream application function logs.
  - Options:
    - `-u, --functionUniversalIdentifier <id>`: Only show logs for a specific function universal ID.
    - `-n, --functionName <name>`: Only show logs for a specific function name.

- `clientvault function:execute [appPath]` — Execute a logic function with a JSON payload.
  - Options:
    - `--postInstall`: Execute the post-install logic function defined in the application config (required if `-n` and `-u` not provided).
    - `-n, --functionName <name>`: Name of the function to execute (required if `--postInstall` and `-u` not provided).
    - `-u, --functionUniversalIdentifier <id>`: Universal ID of the function to execute (required if `--postInstall` and `-n` not provided).
    - `-p, --payload <payload>`: JSON payload to send to the function (default: `{}`).

Examples:

```bash
# Start dev mode (watch, build, and sync)
clientvault app:dev

# Start dev mode with a custom workspace profile
clientvault app:dev --workspace my-custom-workspace

# Add a new entity interactively
clientvault entity:add

# Add a new function
clientvault entity:add function

# Add a new front component
clientvault entity:add front-component

# Add a new view
clientvault entity:add view

# Add a new navigation menu item
clientvault entity:add navigation-menu-item

# Uninstall the app from the workspace
clientvault app:uninstall

# Watch all function logs
clientvault function:logs

# Watch logs for a specific function by name
clientvault function:logs -n my-function

# Execute a function by name (with empty payload)
clientvault function:execute -n my-function

# Execute a function with a JSON payload
clientvault function:execute -n my-function -p '{"name": "test"}'

# Execute a function by universal identifier
clientvault function:execute -u e56d363b-0bdc-4d8a-a393-6f0d1c75bdcf -p '{"key": "value"}'

# Execute the post-install function
clientvault function:execute --postInstall
```

## Configuration

The CLI stores configuration per user in a JSON file:

- Location: `~/.clientvault/config.json`
- Structure: Profiles keyed by workspace name. The active profile is selected with `--workspace <name>` or by the `defaultWorkspace` setting.

Example configuration file:

```json
{
  "defaultWorkspace": "prod",
  "profiles": {
    "default": {
      "apiUrl": "http://localhost:3000",
      "apiKey": "<your-api-key>"
    },
    "prod": {
      "apiUrl": "https://api.clientvault.com",
      "apiKey": "<your-api-key>"
    }
  }
}
```

Notes:

- If a profile is missing, `apiUrl` defaults to `http://localhost:3000` until set.
- `clientvault auth:login` writes the `apiUrl` and `apiKey` for the active workspace profile.
- `clientvault auth:login --workspace custom-workspace` writes the `apiUrl` and `apiKey` for a custom `custom-workspace` profile.
- `clientvault auth:switch` sets the `defaultWorkspace` field, which is used when `--workspace` is not specified.
- `clientvault auth:list` shows all configured workspaces and their authentication status.


## Troubleshooting
- Auth errors: run `clientvault auth:login` again and ensure the API key has the required permissions.
- Typings out of date: restart `clientvault app:dev` to refresh the client and types.
- Not seeing changes in dev: make sure dev mode is running (`clientvault app:dev`).

## Contributing

### Development Setup

To contribute to the clientvault-sdk package, clone the repository and install dependencies:

```bash
git clone https://github.com/clientvaulthq/clientvault.git
cd clientvault
yarn install
```

### Development Mode

Run the SDK build in watch mode to automatically rebuild on file changes:

```bash
npx nx run clientvault-sdk:dev
```

This will watch for changes and rebuild the `dist` folder automatically.

### Production Build

Build the SDK for production:

```bash
npx nx run clientvault-sdk:build
```

### Running the CLI Locally

After building, you can run the CLI directly:

```bash
npx nx run clientvault-sdk:start -- <command>
# Example: npx nx run clientvault-sdk:start -- auth:status
```

Or run the built CLI directly:

```bash
node packages/clientvault-sdk/dist/cli.cjs <command>
```

### Resources
- See our [GitHub](https://github.com/clientvaulthq/clientvault)
- Join our [Discord](https://discord.gg/cx5n4Jzs57)
