# Full Stack Auth App

[![CI](https://github.com/MahmoudElhefnawyy/full-stack-user-authentication-system/actions/workflows/ci.yml/badge.svg)](https://github.com/MahmoudElhefnawyy/full-stack-user-authentication-system/actions/workflows/ci.yml)

A user authentication module built with React + NestJS. Covers sign up, sign in, and a protected home page.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Forms | react-hook-form + Zod |
| Backend | NestJS, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT (HS256), bcrypt |
| Docs | Swagger / OpenAPI |

## Project Structure

```
/
├── client/   # React frontend (Vite)
└── server/   # NestJS backend
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone the repo

```bash
git clone <repo-url>
cd <repo-name>
```

### 2. Start the backend

```bash
cd server
cp .env.example .env   # fill in your values
npm install
npm run start:dev
```

Server runs at `http://localhost:3000`
Swagger docs at `http://localhost:3000/api`

### 3. Start the frontend

```bash
cd client
cp .env.example .env   # set VITE_API_URL if needed
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Environment Variables

### server/.env

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/auth-app` |
| `JWT_SECRET` | Secret for signing JWTs — **change in production** | — |
| `JWT_EXPIRES_IN` | Token expiry | `1h` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

### client/.env

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `http://localhost:3000` |

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | No | Register a new user |
| POST | `/auth/signin` | No | Sign in, returns JWT |
| GET | `/auth/profile` | Bearer token | Get current user profile |

Full interactive docs available at `/api` when the server is running.

## Testing

```bash
cd server
npm test              # run all unit tests
npm run test:cov      # with coverage report
```

The `AuthService` is fully unit-tested (7 tests) covering sign up, sign in, password hashing, and profile retrieval. All external dependencies (MongoDB, JWT) are mocked so no database connection is required to run the tests.
