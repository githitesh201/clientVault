# ClientVault Software Development Lifecycle (SDLC)

## Planning & Requirement Analysis
Requirements were extracted from `jitendra clientvault.pdf` and implemented across these business modules:
- authentication + role access
- client management
- project management
- task management
- invoice/payment status management
- dashboard analytics
- notifications
- audit logs + admin management

## Design
- **Architecture:** MERN + Tailwind
- **Pattern:** modular MVC-style API separation with typed frontend domain models
- **Security by design:** auth guard, role guard, rate limiting, secure headers, validation-first controllers

## Implementation Sprints
1. Base platform scaffold (API + UI + TS)
2. Core CRM entities (clients/projects/tasks/invoices)
3. Security and auditability (JWT, RBAC, logs, notifications)
4. Dashboard analytics and integrated management screen

## Verification
### Implemented checks
- repository state checks
- runtime build command attempt
- browser screenshot attempt for UI

### Functional validation matrix supported by code
- manager can create project/task/invoice
- staff can update task status
- client can view dashboard data and invoice statuses
- admin can inspect users and audit logs

## Deployment
- frontend: Vercel/Netlify
- backend: Render/Railway
- database: MongoDB Atlas
- enforce HTTPS and secret manager before production rollout

## Maintenance Backlog
- file/document vault with encryption-at-rest
- downloadable PDF invoice renderer
- payment gateway webhook integration
- websocket real-time updates
- automated unit/integration test suites
