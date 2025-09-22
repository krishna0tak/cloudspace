# Cloudspace Task Manager

Full-stack Task Manager application built with:

- **Backend**: Node.js + Express (in-memory storage for tasks)
- **Frontend**: React (Vite) + Tailwind CSS

> Current implementation uses an in-memory store (data resets on server restart).

## Features

Implemented:

- Create, read, update, delete tasks (CRUD)
- Task fields: `id`, `title`, `description`, `status (pending|in-progress|done)`, `dueDate`, timestamps
- Filter tasks by status (All, Pending, In-Progress, Done)
- Inline status cycle (click status badge to advance pending → in-progress → done)
- Edit existing tasks (prefills form)
- Cancel edit & create new task mode
- Responsive layout with Tailwind utility classes

Planned / Future Enhancements:

- Persistent database (e.g., Postgres / Prisma)
- User accounts & auth
- Search & sorting
- Pagination / virtual list for large datasets
- Tests (Jest + React Testing Library + supertest)

## Monorepo Structure

```
root/
	package.json        # npm workspaces + concurrent dev script
	server/             # Express API (in-memory data)
		index.js
		package.json
	client/             # React + Vite + Tailwind frontend
		src/
			components/
			main.jsx
			index.css
		vite.config.js
		tailwind.config.js
```

## Quick Start

Requirements: Node.js 18+ (tested on Node 22), npm 9+.

Install all workspace dependencies and start both servers:

```
npm install
npm run dev
```

Services:

- Frontend: http://localhost:5173
- API: http://localhost:4000 (proxied to `/api` from the frontend dev server)

If you only want the API:

```
npm run dev:server
```

If you only want the frontend:

```
npm run dev:client
```

## API Reference

Base URL (dev): `http://localhost:4000/api`

| Method | Endpoint        | Description                | Body (JSON) |
|--------|-----------------|----------------------------|-------------|
| GET    | /health         | Health check               | - |
| GET    | /tasks          | List tasks (optional `?status=pending|in-progress|done`) | - |
| POST   | /tasks          | Create task                | `{ title, description?, status?, dueDate? }` |
| GET    | /tasks/:id      | Get single task            | - |
| PUT    | /tasks/:id      | Replace entire task        | `{ title, description?, status, dueDate }` (all required except optional description) |
| PATCH  | /tasks/:id      | Partial update             | Any subset of fields |
| DELETE | /tasks/:id      | Delete task                | - |

### Task Object Shape

```json
{
	"id": "string",
	"title": "string",
	"description": "string",
	"status": "pending" | "in-progress" | "done",
	"dueDate": "2025-09-22" | null,
	"createdAt": "ISO timestamp",
	"updatedAt": "ISO timestamp"
}
```

Validation rules:

- `title`: required, non-empty string
- `description`: optional string
- `status`: one of `pending | in-progress | done` (defaults to `pending`)
- `dueDate`: valid date string or null

### Examples

Create a task:

```
curl -X POST http://localhost:4000/api/tasks \
	-H "Content-Type: application/json" \
	-d '{"title":"Write docs","description":"README + API","dueDate":"2025-09-30"}'
```

Filter tasks:

```
curl http://localhost:4000/api/tasks?status=pending
```

Update status:

```
curl -X PATCH http://localhost:4000/api/tasks/<id> \
	-H "Content-Type: application/json" \
	-d '{"status":"done"}'
```

## Frontend Notes

- Vite dev server proxies `/api/*` → `http://localhost:4000`
- State is kept client-side; refreshing after server restart may show empty list (in-memory)
- Status badge click cycles statuses
- Editing a task pre-fills the form; Cancel resets it

## Styling (Tailwind)

Tailwind v4+ with PostCSS plugin `@tailwindcss/postcss`. Content scanning defined in `tailwind.config.js`.

## Deploying to Vercel

You can deploy only the frontend plus serverless API (in-memory) using the Vercel CLI. A lightweight serverless version of the API has been added under `client/api/` so the React app and API can live in a single Vercel project.

### 1. Install Vercel CLI

```
npm i -g vercel
```

### 2. Deploy (First Time)

From the `client` directory (so Vercel uses that as the project root and picks up the `api/` functions and Vite config):

```
cd client
vercel        # answer prompts (scope, create project). Accept defaults; build command: `vite build`, output: `dist`.
```

### 3. Production Deploy

```
vercel --prod
```

### 4. Result

- Frontend served from the built `dist` output
- API endpoints available at `/api/health`, `/api/tasks`, `/api/tasks/:id` (serverless, non-persistent)

### Notes

- This serverless API is separate from the local Express dev server (`server/`). For persistence or advanced middleware keep the Express app and deploy it to a service that supports long-lived Node processes (Render, Fly.io, Railway) then point the frontend to that API base URL.
- Memory resets on cold starts; data is ephemeral.
- For a unified production build with persistence, migrate logic shared between Express and serverless into a common module.

### Local Emulation (optional)

```
cd client
vercel dev
```

This will run Vite and serverless functions together locally (similar to `npm run dev` with the Express server, but using the serverless API implementation).

## Scripts Summary

| Script | Location | Purpose |
|--------|----------|---------|
| `npm run dev` | root | Run API + frontend concurrently |
| `npm run dev:server` | root | API only (nodemon) |
| `npm run dev:client` | root | Frontend only (Vite) |
| `npm run build` | client (run with -w) | Build production frontend bundle |

## Roadmap

- Persistence layer (database)
- Testing suite
- CI workflow
- Docker compose for multi-service dev
- Dark mode / theme toggle

## License

MIT (add a LICENSE file if distributing publicly)

---

Feel free to open issues / enhancements as you evolve this project.