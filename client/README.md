# Auth App — React Frontend

React + TypeScript frontend for the user authentication module.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`. Make sure the backend is running first.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend base URL | `http://localhost:3000` |

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # run ESLint
```

## Pages

| Route | Access | Description |
|---|---|---|
| `/signup` | Public | Registration form |
| `/signin` | Public | Login form |
| `/` | Protected | Home page (requires JWT) |

Unauthenticated users accessing `/` are redirected to `/signin` automatically.
