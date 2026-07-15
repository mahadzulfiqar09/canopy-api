# Canopy API

**DecodeLabs Full Stack Development Internship — Batch 2026**
Milestone: Project 2, *Backend API Development*

Canopy API is the backend engine for the Canopy task dashboard (Project 1).
It's a small, dependable REST API — plain Express, an in-memory data store,
and nothing else — built to demonstrate the fundamentals of server-side
logic before a real database enters the picture: endpoints, validation,
status codes, and predictable errors.

A full write-up of the architecture and design decisions is in
**`Project_2_Report.docx`**, included alongside this README.

---

## 1. Overview

| | |
|---|---|
| **Goal** | A simple backend API that handles application logic for the Canopy task dashboard |
| **Stack** | Node.js · Express · in-memory data store (no database, by design) |
| **Style** | RESTful — resources are nouns, HTTP methods are verbs |
| **Auth** | API-key gate (`x-api-key`) on write operations only |
| **Format** | JSON in, JSON out |

## 2. Project structure

```
canopy-api/
├── src/
│   ├── server.js                Boots the HTTP server
│   ├── app.js                    Express app: middleware, routes, error handling
│   ├── routes/
│   │   ├── tasks.routes.js        /api/tasks endpoints
│   │   └── health.routes.js       /api/health liveness check
│   ├── controllers/
│   │   └── tasks.controller.js    Request handling logic per route
│   ├── middleware/
│   │   ├── validateTask.js        Request-body validation (the "gatekeeper")
│   │   ├── apiKeyAuth.js          x-api-key check for write requests
│   │   └── errorHandler.js        404 handler + central error formatter
│   ├── data/
│   │   └── store.js              In-memory task store (swap for a DB later)
│   └── utils/
│       └── ApiError.js           Error class carrying an HTTP status code
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── Project_2_Report.docx
```

## 3. Getting started

**Requirements:** Node.js 18+ and npm.

```bash
cd canopy-api
npm install
cp .env.example .env
npm start
```

The server starts on `http://localhost:4000` (configurable via `PORT` in `.env`).

```bash
# confirm it's alive
curl http://localhost:4000/api/health
```

Use `npm run dev` during development — it restarts automatically on file changes (Node's built-in `--watch`).

## 4. Configuration

Set these in `.env` (see `.env.example`):

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | Port the server listens on |
| `API_KEY` | `canopy-dev-key` | Required in the `x-api-key` header for POST/PUT/DELETE |
| `CORS_ORIGIN` | `*` | Allowed browser origin(s) |

If `API_KEY` is left unset, write endpoints are open — useful for quick local
testing, not recommended beyond that.

## 5. API reference

Base URL: `http://localhost:4000/api`

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Liveness check — returns service status and uptime |

### Tasks

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/tasks` | — | List tasks. Supports `?bed=deep-work` and `?done=true` filters |
| `GET` | `/tasks/:id` | — | Get a single task by id |
| `POST` | `/tasks` | ✅ `x-api-key` | Create a task |
| `PUT` | `/tasks/:id` | ✅ `x-api-key` | Update a task (any of `title`, `bed`, `done`) |
| `DELETE` | `/tasks/:id` | ✅ `x-api-key` | Delete a task |

**Task shape**
```json
{
  "id": "t_a7301531cf",
  "title": "Deploy the API",
  "bed": "admin",
  "done": false,
  "createdAt": "2026-07-15T06:51:29.463Z"
}
```
`bed` is one of: `deep-work`, `admin`, `learning`.

### Executable examples

```bash
# List all tasks
curl http://localhost:4000/api/tasks

# Filter by bed
curl "http://localhost:4000/api/tasks?bed=admin"

# Create a task
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -H "x-api-key: canopy-dev-key" \
  -d '{"title": "Deploy the API", "bed": "admin"}'

# Mark a task done
curl -X PUT http://localhost:4000/api/tasks/<id> \
  -H "Content-Type: application/json" \
  -H "x-api-key: canopy-dev-key" \
  -d '{"done": true}'

# Delete a task
curl -X DELETE http://localhost:4000/api/tasks/<id> \
  -H "x-api-key: canopy-dev-key"
```

## 6. Status codes

The API uses status codes as the primary signal, not just the response body:

| Code | Meaning | When |
|---|---|---|
| `200` | OK | Successful `GET` / `PUT` |
| `201` | Created | Successful `POST` |
| `204` | No Content | Successful `DELETE` |
| `400` | Bad Request | Validation failed (missing/invalid fields) |
| `401` | Unauthorized | Missing or incorrect `x-api-key` on a write request |
| `404` | Not Found | Unknown task id, or an unmatched route |
| `429` | Too Many Requests | Rate limit exceeded (120 requests/minute/IP on `/api/*`) |
| `500` | Internal Server Error | Unexpected server-side failure |

Every error, regardless of cause, returns the same predictable shape:

```json
{
  "error": {
    "status": 400,
    "message": "Validation failed.",
    "details": ["`title` is required and must be a non-empty string."]
  }
}
```

## 7. Design principles

- **Never trust the client.** Every write request passes through
  `validateTask.js` before it touches the store — syntactic checks (right
  types, right shape) ahead of any business logic.
- **Resources are nouns, methods are verbs.** `GET /tasks`, not
  `GET /getTasks`; `POST /tasks`, not `POST /createTask`.
- **Stateless requests.** Nothing about a request depends on a previous one
  except the `x-api-key` header — any instance of this server can handle
  any request.
- **Predictable errors.** One error shape, one place (`errorHandler.js`)
  that produces it, so clients never have to branch on error format.
- **Swap-ready persistence.** All data access goes through `data/store.js`.
  Replacing the in-memory array with a real database means changing that
  one file, not the routes or controllers.

## 8. Testing it end to end

Every endpoint above was exercised manually during development
(200/201/204 happy paths, plus 400/401/404 failure paths) with `curl`. For
automated coverage, this project structure is ready to drop
`supertest` + `jest` in without any refactor, since `app.js` exports a
plain Express app rather than starting the server itself.

## 9. Where this goes next

Project 2 is the API phase. Later milestones layer a real database on top:

- Swap `src/data/store.js` for a database client (e.g. Postgres via `pg`
  or SQLite via `better-sqlite3`) — the function signatures stay the same.
- Replace the single shared `API_KEY` with per-user auth (sessions or JWT)
  once there's a user model to attach permissions to.
- Point the Canopy frontend (Project 1) at this API by replacing the
  in-memory `tasks` array in its `js/app.js` with `fetch()` calls to
  these endpoints.

## 10. Credits

Built for the DecodeLabs Full Stack Development Internship, Batch 2026.
📍 Greater Lucknow, India · 🌎 www.decodelabs.tech · ✉ decodelabs.tech@gmail.com
