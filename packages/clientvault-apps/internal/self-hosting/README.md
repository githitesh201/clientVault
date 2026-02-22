# Self Hosting

Used to manage billing and telemetry of self-hosted instances

## Requirements
- clientvault-cli `npm install -g clientvault-cli`
- an `apiKey`. Go to `https://clientvault.com/settings/api-webhooks` to generate one


## Install to your ClientVault workspace

```bash
clientvault auth login
clientvault app sync
```

## Environment Variables

This application requires the following environment variables to be set:

- `CLIENTVAULT_API_URL`: The ClientVault instance API URL where selfHostingUser records will be created
- `CLIENTVAULT_API_KEY`: API key for authentication (generate at `/settings/api-webhooks`)

## Features

### Telemetry Webhook

Receives user signup telemetry events from self-hosted ClientVault instances and creates/updates selfHostingUser records.

**Endpoint:** `POST /webhook/telemetry`

**Payload Structure:**
```json
{
  "action": "user_signup",
  "timestamp": "2025-11-21T...",
  "version": "1",
  "payload": {
    "userId": "uuid",
    "workspaceId": "uuid",
    "payload": {
      "events": [
        {
          "userEmail": "user@example.com",
          "userId": "uuid",
          "userFirstName": "John",
          "userLastName": "Doe",
          "locale": "en",
          "serverUrl": "https://self-hosted.example.com"
        }
      ]
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Self hosting user created/updated: uuid"
}
```
