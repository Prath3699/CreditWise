# CredWise

CredWise is a free credit-score **estimator and education** app. It uses a deterministic,
shared scoring model so the React client and Express API always produce the same result for
the same inputs. It is not a credit bureau and does not fetch real credit reports.

## What it does

- Instant score estimates from utilization, credit age, payment history, and credit mix.
- Interactive "what if" simulator for paying down debt, on-time payments, and new inquiries.
- Optional account with saved score history and a trend sparkline.
- Score-band explanations, risk levels, and loan-eligibility guidance.
- Dark/light themes, keyboard-accessible dialogs, reduced-motion support, and an error boundary.

## Tech stack

| Layer    | Tools                                                           |
| -------- | --------------------------------------------------------------- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS 4, Framer Motion       |
| Backend  | Node.js, Express 4, Mongoose, JWT (httpOnly cookie), bcryptjs   |
| Shared   | `shared/scoring.js` with TypeScript declarations                |
| Tests    | Vitest + Testing Library (frontend), Node test runner (backend) |

## Project structure

```
.
├── src/                  React app (components, context, API client, tests)
├── backend/              Express API (routes, controllers, models, tests)
├── shared/               Canonical scoring engine + types
├── scripts/smoke.mjs     Optional Playwright smoke test
├── archive/legacy-static Archived pre-React static prototype
├── netlify.toml          SPA redirects, security headers, asset caching
└── .github/workflows/    CI (lint, format, typecheck, tests, build)
```

## Getting started

### Prerequisites

- Node.js 20+
- MongoDB 7+ (optional in development; the backend falls back to an in-memory database)

### 1. Install

```bash
npm ci
cd backend
npm ci
```

### 2. Configure

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Frontend variables:

| Variable           | Default                 | Purpose                                                   |
| ------------------ | ----------------------- | --------------------------------------------------------- |
| `API_PROXY_TARGET` | `http://localhost:5000` | Vite dev-server proxy target for `/api`                   |
| `VITE_API_URL`     | `/api`                  | Optional absolute API URL for a separately hosted backend |

Backend variables:

| Variable          | Default                            | Purpose                                               |
| ----------------- | ---------------------------------- | ----------------------------------------------------- |
| `NODE_ENV`        | `development`                      | Enables production security checks                    |
| `PORT`            | `5000`                             | API port                                              |
| `MONGO_URI`       | local MongoDB then in-memory (dev) | MongoDB connection string; required in production     |
| `JWT_SECRET`      | dev-only fallback                  | JWT signing key; production requires 32+ characters   |
| `CORS_ORIGINS`    | —                                  | Comma-separated allowed frontend origins              |
| `COOKIE_SAMESITE` | `lax` (dev) / `none` (production)  | Cookie policy for same-site or cross-site deployments |

Generate a production secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run

Start the API and frontend in separate terminals:

```bash
cd backend
npm run dev
```

```bash
npm run dev
```

Open <http://localhost:3000>. The Vite dev server proxies `/api` to the backend.

## API

All score routes require authentication. Authentication uses an httpOnly cookie
(`credwise_token`); API clients may also send `Authorization: Bearer <token>`.

| Method | Path                    | Auth | Description                           |
| ------ | ----------------------- | ---- | ------------------------------------- |
| POST   | `/api/auth/register`    | No   | Create account and set session cookie |
| POST   | `/api/auth/login`       | No   | Sign in and set session cookie        |
| POST   | `/api/auth/logout`      | No   | Clear the session cookie              |
| GET    | `/api/auth/me`          | Yes  | Return the signed-in user             |
| POST   | `/api/scores/calculate` | Yes  | Calculate and save a score            |
| POST   | `/api/scores/simulate`  | Yes  | Simulate score changes                |
| GET    | `/api/scores/history`   | Yes  | Last 20 saved scores                  |
| GET    | `/api/scores/latest`    | Yes  | Most recent score with band metadata  |
| GET    | `/api/health`           | No   | Health and database status            |

Example:

```bash
curl -i -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  --data '{"email":"you@example.com","password":"secret123"}'
```

## Security notes

- Passwords are hashed with bcrypt; JWTs are stored in `httpOnly`, `sameSite`, `secure`
  (production) cookies rather than `localStorage`.
- The API validates input lengths, ranges, and allowed enum values before scoring.
- Helmet security headers, a global rate limit, and a stricter auth rate limit are enabled.
- Write requests must use `application/json`, which blocks classic HTML-form CSRF.
- CORS uses an explicit allowlist with credentials; production refuses to start without a
  strong `JWT_SECRET` and `MONGO_URI`.
- Logout clears the cookie. There is no server-side JWT revocation list, so a stolen token
  remains valid until it expires (7 days).

## Testing and quality checks

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:backend
npm run format:check
npm run build
```

Or run the main gate in one command:

```bash
npm run verify
```

The optional browser smoke test needs a running frontend and backend:

```bash
npm run test:smoke
```

`CHROME_PATH` can point at a Chromium binary; otherwise Playwright's installed browser is used.

## Deployment

### Frontend (Netlify)

1. Build command: `npm run build`; publish directory: `dist`.
2. Set `VITE_API_URL` to the deployed API base (for example
   `https://credwise-api.example.com/api`) if the API is not on the same origin.
3. Add the Netlify site origin to the backend's `CORS_ORIGINS`.
4. Set `COOKIE_SAMESITE=none` on the backend for cross-site cookies over HTTPS.

`netlify.toml` includes SPA redirects, CSP/security headers, and long-lived asset caching.

### Backend

Set `NODE_ENV=production`, `MONGO_URI`, a 32+ character `JWT_SECRET`, and `CORS_ORIGINS`,
then run `npm start`. The server exits on startup if production configuration is unsafe.

## Limitations

- Scores are **educational estimates**, not FICO or VantageScore values.
- No real credit report, bureau connection, or hard inquiry is involved.
- History is limited to scores saved while signed in.
- The archived `archive/legacy-static` prototype is reference-only and not deployed.
