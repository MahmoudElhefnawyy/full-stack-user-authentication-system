# Auth API — NestJS Backend

REST API for user authentication built with NestJS and MongoDB.

## Setup

```bash
cp .env.example .env   # fill in your values
npm install
npm run start:dev
```

## Environment Variables

Copy `.env.example` to `.env` and set:

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `3000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs — use a strong random value in production |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `1h`, `7d`) |
| `FRONTEND_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |

## Scripts

```bash
npm run start:dev   # development with hot reload
npm run start:prod  # production
npm run test        # unit tests
npm run test:e2e    # end-to-end tests
```

## API Reference

Interactive Swagger docs are available at `http://localhost:3000/api` when the server is running.

### Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | — | Register a new user |
| POST | `/auth/signin` | — | Sign in, returns `accessToken` |
| GET | `/auth/profile` | `Bearer <token>` | Get current user profile (protected) |

### POST /auth/signup

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "Passw0rd!"
}
```

Password rules: min 8 chars, at least one letter, one number, one special character.

### POST /auth/signin

```json
{
  "email": "user@example.com",
  "password": "Passw0rd!"
}
```

Returns:

```json
{ "accessToken": "<jwt>" }
```

### GET /auth/profile

Requires `Authorization: Bearer <token>` header.

Returns:

```json
{
  "id": "...",
  "email": "user@example.com",
  "name": "John Doe"
}
```
