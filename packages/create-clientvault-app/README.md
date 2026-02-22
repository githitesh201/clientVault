<div align="center">
  <a href="https://clientvault.com">
    <picture>
      <img alt="ClientVault logo" src="https://raw.githubusercontent.com/clientvaulthq/clientvault/2f25922f4cd5bd61e1427c57c4f8ea224e1d552c/packages/clientvault-website/public/images/core/logo.svg" height="128">
    </picture>
  </a>
  <h1>Create ClientVault App</h1>

<a href="https://www.npmjs.com/package/create-clientvault-app"><img alt="NPM version" src="https://img.shields.io/npm/v/create-clientvault-app.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/clientvaulthq/clientvault/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://discord.gg/cx5n4Jzs57"><img alt="Join the community on Discord" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&logo=ClientVault&labelColor=000000&logoWidth=20"></a>

</div>

Create ClientVault App is the official scaffolding CLI for building apps on top of [ClientVault CRM](https://clientvault.com). It sets up a ready‑to‑run project that works seamlessly with the [clientvault-sdk](https://www.npmjs.com/package/clientvault-sdk).

- Zero‑config project bootstrap
- Preconfigured scripts for auth, dev mode (watch & sync), uninstall, and function management
- Strong TypeScript support and typed client generation

## Documentation
See ClientVault application documentation https://docs.clientvault.com/developers/extend/capabilities/apps

## Prerequisites
- Node.js 24+ (recommended) and Yarn 4
- A ClientVault workspace and an API key (create one at https://app.clientvault.com/settings/api-webhooks)

## Quick start

```bash
npx create-clientvault-app@latest my-clientvault-app
cd my-clientvault-app

# If you don't use yarn@4
corepack enable
yarn install

# Get help and list all available commands
yarn clientvault help

# Authenticate using your API key (you'll be prompted)
yarn clientvault auth:login

# Add a new entity to your application (guided)
yarn clientvault entity:add

# Start dev mode: watches, builds, and syncs local changes to your workspace
# (also auto-generates a typed API client in node_modules/clientvault-sdk/generated)
yarn clientvault app:dev

# Watch your application's function logs
yarn clientvault function:logs

# Execute a function with a JSON payload
yarn clientvault function:execute -n my-function -p '{"key": "value"}'

# Execute the post-install function
yarn clientvault function:execute --postInstall

# Uninstall the application from the current workspace
yarn clientvault app:uninstall
```

## Scaffolding modes

Control which example files are included when creating a new app:

| Flag | Behavior |
|------|----------|
| `-e, --exhaustive` | **(default)** Creates all example files without prompting |
| `-m, --minimal` | Creates only core files (`application-config.ts` and `default-role.ts`) |
| `-i, --interactive` | Prompts you to select which examples to include |

```bash
# Default: all examples included
npx create-clientvault-app@latest my-app

# Minimal: only core files
npx create-clientvault-app@latest my-app -m

# Interactive: choose which examples to include
npx create-clientvault-app@latest my-app -i
```

In interactive mode, you can pick from:
- **Example object** — a custom CRM object definition (`objects/example-object.ts`)
- **Example field** — a custom field on the example object (`fields/example-field.ts`)
- **Example logic function** — a server-side handler with HTTP trigger (`logic-functions/hello-world.ts`)
- **Example front component** — a React UI component (`front-components/hello-world.tsx`)
- **Example view** — a saved view for the example object (`views/example-view.ts`)
- **Example navigation menu item** — a sidebar link (`navigation-menu-items/example-navigation-menu-item.ts`)

## What gets scaffolded

**Core files (always created):**
- `application-config.ts` — Application metadata configuration
- `roles/default-role.ts` — Default role for logic functions
- `logic-functions/post-install.ts` — Post-install logic function (runs after app installation)
- TypeScript configuration, ESLint, package.json, .gitignore
- A prewired `clientvault` script that delegates to the `clientvault` CLI from clientvault-sdk

**Example files (controlled by scaffolding mode):**
- `objects/example-object.ts` — Example custom object with a text field
- `fields/example-field.ts` — Example standalone field extending the example object
- `logic-functions/hello-world.ts` — Example logic function with HTTP trigger
- `front-components/hello-world.tsx` — Example front component
- `views/example-view.ts` — Example saved view for the example object
- `navigation-menu-items/example-navigation-menu-item.ts` — Example sidebar navigation link

## Next steps
- Run `yarn clientvault help` to see all available commands.
- Use `yarn clientvault auth:login` to authenticate with your ClientVault workspace.
- Explore the generated project and add your first entity with `yarn clientvault entity:add` (logic functions, front components, objects, roles, views, navigation menu items).
- Use `yarn clientvault app:dev` while you iterate — it watches, builds, and syncs changes to your workspace in real time.
- Types are auto‑generated by `yarn clientvault app:dev` and stored in `node_modules/clientvault-sdk/generated`.


## Publish your application
Applications are currently stored in `clientvault/packages/clientvault-apps`.

You can share your application with all ClientVault users:

```bash
# pull the ClientVault project
git clone https://github.com/clientvaulthq/clientvault.git
cd clientvault

# create a new branch
git checkout -b feature/my-awesome-app
```

- Copy your app folder into `clientvault/packages/clientvault-apps`.
- Commit your changes and open a pull request on https://github.com/clientvaulthq/clientvault

```bash
git commit -m "Add new application"
git push
```

Our team reviews contributions for quality, security, and reusability before merging.

## Troubleshooting
- Auth prompts not appearing: run `yarn clientvault auth:login` again and verify the API key permissions.
- Types not generated: ensure `yarn clientvault app:dev` is running — it auto‑generates the typed client.

## Contributing
- See our [GitHub](https://github.com/clientvaulthq/clientvault)
- Join our [Discord](https://discord.gg/cx5n4Jzs57)
