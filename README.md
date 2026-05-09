# HelpDesk Lite (Modern MVP)

Lightweight full-stack HelpDesk app with:

- React frontend (`/client`)
- Express backend (`/server`)
- JWT auth + role-based workflows
- SQLite persistence (local file `server/helpdesk.sqlite`)
- Tailwind CSS modern SaaS dashboard UI

## Demo Accounts

- Admin: `admin@helpdesk.com` / `password123`
- Agent: `agent@helpdesk.com` / `password123`
- User: `user@helpdesk.com` / `password123`

## Run Locally

### Backend
```bash
cd server
npm install
npm run dev