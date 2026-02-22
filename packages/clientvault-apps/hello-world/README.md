# Hello world

A minimal hello-world application built with an alpha version of the clientvault-cli.

⚠️ Since this project uses an early alpha release, expect breaking changes and evolving features.

This example will gradually gain complexity and capabilities as the clientvault-cli matures with future updates.


## Requirements
- clientvault-cli `npm install -g clientvault-cli`
- an `apiKey`. Go to `/settings/api-webhooks` to generate one


## Install to your ClientVault workspace

```bash
cp .env.example .env
```

- replace `<SET_YOUR_CLIENTVAULT_API_KEY>` and `<SET_YOUR_CLIENTVAULT_API_URL>` accordingly

```bash
clientvault auth login
clientvault app sync
```

## What it does
- creates a new object `postCard` with a `name` field
- creates a serverless function `create-new-post-card`
- two triggers on `create-new-post-card`:
  - one route trigger on `GET` `/post-card/create?recipient=RecipientName`
  - one databaseEvent trigger on `people.created` events

## Development

Run dev mode and see application updates on your workspace instantly

```bash
clientvault app dev
```
