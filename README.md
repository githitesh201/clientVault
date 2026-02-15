# ClientVault (Full MERN Implementation)

ClientVault is a full-featured CRM-style business management web app based on `jitendra clientvault.pdf`, built using **MongoDB + Express + React + Node + Tailwind CSS**.

## Implemented Modules

### 1) Authentication & Role Access
- JWT login/register
- Password hashing (`bcryptjs`)
- Roles: `admin`, `manager`, `staff`, `client`
- Role-based route permissions

### 2) Client Management
- Add/list clients
- Status tracking (`lead`, `active`, `inactive`)

### 3) Project Management
- Create/list projects
- Project status updates (`planned`, `active`, `on_hold`, `completed`)
- Linked to clients and managers

### 4) Task Management
- Create/list tasks
- Real-time style status updates (`todo`, `in_progress`, `blocked`, `completed`)
- Due date + priority tracking

### 5) Invoice Management
- Create/list invoices
- Automatic overdue marking
- Mark as paid endpoint
- Support for billing types (`milestone`, `scheduled`, `full`)

### 6) Dashboard Analytics
- Live counters:
  - total clients
  - active projects
  - pending tasks
  - overdue invoices

### 7) Notifications
- Notification records for task and invoice events
- Mark as read endpoint

### 8) Audit Logs & Admin Controls
- Audit log for project/task/invoice updates
- Admin endpoints for user and audit inspection

## Security Enhancements
- `helmet` security headers
- `express-rate-limit`
- strict environment parsing with `zod`
- centralized error handling
- JWT auth guard and role middleware

## Optimization & Engineering Practices
- TypeScript backend + frontend
- Modular architecture (models/controllers/routes/middleware/services)
- Lean reads where applicable
- CI workflow (`npm install` + `npm run build`)

## Project Structure
- `backend/` API and data layer
- `frontend/` React UI
- `docs/software-lifecycle.md` SDLC plan + backlog

## Run
```bash
npm install
cp backend/.env.example backend/.env
npm run dev:backend
npm run dev:frontend
```


## Ship Readiness Notes
- This repository now avoids blocked scoped dev-type packages in this environment, so dependency installation and workspace builds can complete under restricted npm policies.
- Runtime remains MERN (Express + MongoDB + React + Node); TypeScript source is executed with `tsx` during development.
