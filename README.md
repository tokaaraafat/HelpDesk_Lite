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

1. Backend
   - `cd server`
   - `npm install`
   - `npm run dev`
2. Frontend (new terminal)
   - `cd client`
   - `npm install`
   - `npm run dev`
3. Open `http://localhost:5173`

## Environment (Optional)

- Frontend API URL:
  - create `client/.env` with `VITE_API_URL=http://localhost:5000/api`
- Backend DB path:
  - set `DB_PATH` if you want a custom SQLite file path

## Core Routes

- Health: `GET /api/health`
- Login: `POST /api/auth/login`
- Tickets:
  - `GET /api/tickets`
  - `GET /api/tickets/meta`
  - `GET /api/tickets/assigned/me`
  - `GET /api/tickets/analytics/summary`
  - `GET /api/tickets/:id`
  - `POST /api/tickets`
  - `PUT /api/tickets/:id`
  - `POST /api/tickets/:id/comments`
  - `POST /api/tickets/:id/internal-notes` (admin/agent)