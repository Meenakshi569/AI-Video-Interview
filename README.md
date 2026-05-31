# AI Video Interview System

Automated first-round video screening platform — MERN stack with cloud-ready storage abstraction.

**Current status: Phase 1 (Foundation)** — JWT auth, role-based routes, placeholder dashboards.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) (for MongoDB) *or* a local MongoDB instance

## Quick start

### 1. Start MongoDB

```bash
docker compose up -d
```

### 2. Backend

```bash
cd server
cp .env.example .env
# Edit .env — set JWT_SECRET to a long random string
npm install
npm run dev
```

API: http://localhost:5000  
Health: http://localhost:5000/api/health

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

App: http://localhost:5173 (proxies `/api` to the backend)

## Project structure

```
ai-video-interview/
├── client/          # React + Vite (JSX)
├── server/          # Express + MongoDB
├── shared/          # Shared constants (roles)
├── docker-compose.yml
└── README.md
```

## API (Phase 1)

| Method | Endpoint           | Auth | Description        |
|--------|----------------------|------|--------------------|
| GET    | `/api/health`        | No   | Health check       |
| POST   | `/api/auth/register` | No   | Register + JWT     |
| POST   | `/api/auth/login`    | No   | Login + JWT        |
| GET    | `/api/auth/me`       | Yes  | Current user       |

## Environment variables

See `server/.env.example` and root `.env.example`.

| Variable            | Default                                      | Notes                    |
|---------------------|----------------------------------------------|--------------------------|
| `PORT`              | `5000`                                       | API port                 |
| `MONGODB_URI`       | `mongodb://localhost:27017/ai-video-interview` | Mongo connection       |
| `JWT_SECRET`        | *(required in production)*                   | Sign tokens              |
| `JWT_EXPIRES_IN`    | `7d`                                         | Token lifetime           |
| `CLIENT_URL`        | `http://localhost:5173`                      | CORS origin              |
| `STORAGE_DRIVER`    | `local`                                      | `local` \| `s3` \| `minio` |
| `STORAGE_LOCAL_PATH`| `./uploads`                                  | Local chunk storage      |

## Roles

- **candidate** → `/candidate` dashboard
- **recruiter** → `/recruiter` dashboard
- **admin** → same access as recruiter (reserved)

## Next phases

- **Phase 2:** Interview flow, MediaRecorder chunks, `session_data`
- **Phase 3:** WebSocket proctoring, recruiter review UI
- **Phase 4:** S3/R2 storage, merge queue, Deepgram STT

## License

MIT
