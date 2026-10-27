# EduZone LMS (MERN)

Production-oriented LMS monorepo with:

- `client/` (React + Vite + Redux Toolkit + Tailwind)
- `server/` (Node.js + Express + MongoDB + JWT access/refresh auth)

## Architecture

### Backend (`server/src`)

- `config/` database + env config
- `controllers/` request handlers
- `models/` mongoose schemas
- `routes/` API route modules
- `middlewares/` auth, validation, security, error handling
- `utils/` token helpers, API response helpers, mailer, misc
- `validators/` request validators

### Frontend (`client/src`)

- `components/` shared/admin/lms UI
- `features/` Redux slices by domain
- `hooks/` reusable hooks
- `pages/` route-level views
- `routes/` route guards + app routing
- `services/` axios API client layer
- `app/` Redux store

## Key Implemented Upgrades

- Access + refresh JWT auth flow (`/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`)
- Role-based guards (`admin`, `instructor`, `student`)
- Request validation middleware + validators
- Security middleware:
  - in-memory rate limiting
  - request sanitization against Mongo operator injection keys
  - secure default headers
- Centralized success/error response utilities
- Public browse APIs for courses/blogs
- Course search/filter + pagination metadata
- Enrollment ownership checks + student progress update endpoint
- Analytics APIs with real data:
  - `GET /api/analytics/admin`
  - `GET /api/analytics/instructor`
  - `GET /api/analytics/student`
- Frontend axios interceptor with token refresh retry
- Dashboard pages wired to real analytics API data
- Student learning room wired to backend lessons + enrollment progress persistence

## Run Locally

## 1) Backend

```bash
cd server
npm install
cp .env.example .env
# update .env values
npm run dev
```

## 2) Frontend

```bash
cd client
npm install
cp .env.example .env
# update .env values
npm run dev
```

## 3) URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Environment Variables

### Backend (`server/.env`)

Use `server/.env.example` as reference.

Required:

- `DB_CONFIGURATION`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `CLIENT_URL`
- `BASE_URL`

### Frontend (`client/.env`)

Use `client/.env.example` as reference.

Local development defaults to `http://localhost:5000`. `VITE_BASE_URL` is optional in production because Vercel can proxy the API and uploads through the configured rewrites.

## Render and Vercel deployment

### Render API service

- Set the service root directory to `server`, install with `npm ci`, and start with `npm start`.
- Set `NODE_ENV=production`, `DB_CONFIGURATION`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `CLIENT_URL`, and `BASE_URL`. Use different long random values for the two token secrets. `BASE_URL` is the public Render service origin and `CLIENT_URL` is the exact Vercel site origin.
- The server package declares Node.js `>=20 <25`; keep the Render runtime within that range.
- Configure `/health` as the service health check. It returns success only while MongoDB is connected.
- Uploaded files currently go to `server/uploads`. Render's filesystem is ephemeral by default. Attach a persistent disk mounted at `/opt/render/project/src/server/uploads`, or migrate uploads to durable object storage, before relying on production uploads. The app has no cloud object-storage adapter yet.

### Vercel frontend

- Set the project root directory to `client`, install with `npm ci`, build with `npm run build`, and use `dist` as the output directory.
- `client/vercel.json` rewrites `/api/*` and `/uploads/*` to the configured EduZone Render hostname and sends other paths to the Vite SPA entry point. The root URL now opens the public home route.
- Set `VITE_BASE_URL` to the API origin only when you want direct browser-to-Render requests. If it is unset in production, requests use the same-origin Vercel rewrites. Update the Render hostname in `client/vercel.json` if the service URL changes.
- Set the Render `CLIENT_URL` to the final Vercel production domain so credentialed requests and authentication cookies are accepted.

Before launch, verify both providers' environment values, the MongoDB Atlas network allowlist, the Render persistent upload disk/object storage, and an authenticated production smoke test. A local build cannot verify those hosted settings.
