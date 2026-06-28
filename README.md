# ReleaseCheck

A small single-page app to help developers run through a release checklist.

Each **release** has a name, a date, an optional note and a list of fixed
checklist steps. The release status is **never picked by hand** — it is computed
from the steps:

| Steps completed        | Status    |
| ---------------------- | --------- |
| none                   | `planned` |
| some (but not all)     | `ongoing` |
| all                    | `done`    |

Because the steps are the same for every release, they live in code
(`server/src/steps.js`) rather than in a database table. Each release just
stores the ids of the steps it has completed.

## Tech stack

- **Frontend:** React (Vite) single-page app with React Router
- **Backend:** Node.js + Express REST API
- **Database:** PostgreSQL (single `releases` table)

```
client/   React SPA
server/   Express API + Postgres access
```

## Live demo

**https://cactro-test-lake.vercel.app/**

## Running locally

### Option A — Docker (database + API in one command)

From the project root:

```bash
docker compose up --build
```

This starts Postgres, applies the schema and runs the API on
`http://localhost:5000`.

Then start the frontend:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` to the
backend, so no extra config is needed.

### Option B — without Docker

1. **Database** — have a PostgreSQL database ready (local or hosted) and note
   its connection string.

2. **Backend**

   ```bash
   cd server
   npm install
   cp .env.example .env        # then edit DATABASE_URL
   npm run migrate             # creates the table
   npm run dev                 # API on http://localhost:5000
   ```

   For a local Postgres without SSL, keep `PGSSL=disable` in `.env`.

3. **Frontend**

   ```bash
   cd client
   npm install
   npm run dev                 # http://localhost:5173
   ```

### Tests

```bash
cd server
npm test
```

The tests cover the status-computation rules (planned / ongoing / done) and the
sanitisation of unknown step ids.

## API

Base path: `/api`. All bodies are JSON.

| Method   | Endpoint             | Description                                              |
| -------- | -------------------- | ------------------------------------------------------- |
| `GET`    | `/api/steps`         | The fixed list of checklist steps (`id`, `label`).      |
| `GET`    | `/api/releases`      | List all releases (ordered by date).                    |
| `GET`    | `/api/releases/:id`  | Get a single release.                                    |
| `POST`   | `/api/releases`      | Create a release.                                        |
| `PATCH`  | `/api/releases/:id`  | Update additional info and/or the completed steps.      |
| `DELETE` | `/api/releases/:id`  | Delete a release.                                        |

A release returned by the API looks like:

```json
{
  "id": 1,
  "name": "Version 1.0.1",
  "date": "2022-09-20T00:00:00.000Z",
  "additionalInfo": "",
  "completedSteps": ["prs_merged", "tests_passing"],
  "status": "ongoing"
}
```

`status` is read-only and always derived on the server from `completedSteps`.

### Example requests

Create a release:

```bash
curl -X POST http://localhost:5000/api/releases \
  -H 'Content-Type: application/json' \
  -d '{"name":"Version 1.0.1","date":"2022-09-20T00:00:00.000Z","additionalInfo":""}'
```

Toggle the completed steps:

```bash
curl -X PATCH http://localhost:5000/api/releases/1 \
  -H 'Content-Type: application/json' \
  -d '{"completedSteps":["prs_merged","tests_passing"]}'
```

Update only the note:

```bash
curl -X PATCH http://localhost:5000/api/releases/1 \
  -H 'Content-Type: application/json' \
  -d '{"additionalInfo":"Waiting on QA sign-off"}'
```

## Deployment

The repo includes a `render.yaml` blueprint that provisions the database, the
API and the static frontend together. After the first deploy, set the
frontend's `VITE_API_URL` env var to the API URL and redeploy.

Any host works though — the only requirements are a hosted PostgreSQL database
(set `DATABASE_URL`) for the API, and a static host for the built `client/dist`
folder.

## Features

- View a list of all releases with their name, date and computed status
- Create a new release with a name, date and an optional note
- Open a release to check / uncheck its checklist steps; the status updates
  automatically as steps are completed
- Edit a release's additional remarks and save them
- Delete a release
- Responsive layout that works on small screens
- Run the backend with Docker (`Dockerfile` + `docker-compose.yaml`)
- Automated tests for the status-computation logic
