This is a [ClientVault](https://clientvault.com) application project bootstrapped with [`create-clientvault-app`](https://www.npmjs.com/package/create-clientvault-app).

## Getting Started

First, authenticate to your workspace:

```bash
yarn clientvault auth:login
```

Then, start development mode to sync your app and watch for changes:

```bash
yarn clientvault app:dev
```

Open your ClientVault instance and go to `/settings/applications` section to see the result.

## Available Commands

Run `yarn clientvault help` to list all available commands. Common commands:

```bash
# Authentication
yarn clientvault auth:login     # Authenticate with ClientVault
yarn clientvault auth:logout    # Remove credentials
yarn clientvault auth:status    # Check auth status
yarn clientvault auth:switch    # Switch default workspace
yarn clientvault auth:list      # List all configured workspaces

# Application
yarn clientvault app:dev        # Start dev mode (watch, build, sync, and auto-generate typed client)
yarn clientvault entity:add     # Add a new entity (object, field, function, front-component, role, view, navigation-menu-item)
yarn clientvault function:logs  # Stream function logs
yarn clientvault function:execute  # Execute a function with JSON payload
yarn clientvault app:uninstall  # Uninstall app from workspace
```

## Learn More

To learn more about ClientVault applications, take a look at the following resources:

- [clientvault-sdk](https://www.npmjs.com/package/clientvault-sdk) - learn about `clientvault-sdk` tool.
- [ClientVault doc](https://docs.clientvault.com/) - ClientVault's documentation.
- Join our [Discord](https://discord.gg/cx5n4Jzs57)

You can check out [the ClientVault GitHub repository](https://github.com/clientvaulthq/clientvault) - your feedback and contributions are welcome!
