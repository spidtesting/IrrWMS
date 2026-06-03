# Deploy IrrWMS: Supabase + Railway (+ Upstash)

Recommended production stack:

- **Supabase** — PostgreSQL (data only; app uses NextAuth, not Supabase Auth)
- **Railway** — Next.js app, socket server, cron worker (3 services)
- **Upstash** — Redis for rate limiting and socket pub/sub

Alternative: host the Next.js app on **Vercel** and run socket + worker on Railway (see [Vercel-only web](#optional-vercel-for-nextjs-only)).

---

## Part 1 — Supabase database

### 1. Create project

1. [supabase.com](https://supabase.com) → New project.
2. Save the database password.

### 2. Enable extensions

In **SQL Editor**:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### 3. Connection strings

In **Project Settings → Database**:

| Use case                      | Connection             | Port                                          |
| ----------------------------- | ---------------------- | --------------------------------------------- |
| Migrations & seed (local CLI) | **Direct** / Session   | `5432`                                        |
| Railway web app (long-lived)  | Direct or Session      | `5432`                                        |
| Vercel (serverless)           | **Transaction pooler** | `6543` + `?pgbouncer=true&connection_limit=1` |

Copy the URI and set `?schema=public` if missing.

### 4. Apply schema (from your laptop)

```bash
cp .env.example .env
# Paste Supabase DIRECT URL into DATABASE_URL

npm install
npm run db:generate
npx prisma db push          # first deploy (no migrations folder yet)
# OR: npm run db:migrate    # after you have prisma/migrations

npm run db:seed             # optional demo users (password: Admin@1234)
```

---

## Part 2 — Upstash Redis

1. [console.upstash.com](https://console.upstash.com) → Create Redis database.
2. Copy **REST URL** and **REST Token** (used by the app for rate limiting).
3. For socket/worker pub/sub, also set **`REDIS_URL`** to the Redis `rediss://` URL if Upstash provides it, or use the same Upstash instance’s connection string from the dashboard.

---

## Part 3 — Railway (3 services)

Push your repo to GitHub, then in [railway.app](https://railway.app) create a project and add **three services** from the same repository.

### Service A — Web (Next.js)

| Setting        | Value                                            |
| -------------- | ------------------------------------------------ |
| Build          | `npm ci && npx prisma generate && npm run build` |
| Start          | `npm start`                                      |
| Root directory | `/`                                              |

Or use **Dockerfile** target: `runner`.

**Public domain:** enable → e.g. `https://irrwms-web.up.railway.app`

### Service B — Socket

| Setting           | Value                      |
| ----------------- | -------------------------- |
| Start             | `npx tsx server/socket.ts` |
| Dockerfile target | `socket` (optional)        |

**Public domain:** e.g. `https://irrwms-socket.up.railway.app`  
Health check: `GET /health` on port `3001`.

### Service C — Worker

| Setting           | Value                      |
| ----------------- | -------------------------- |
| Start             | `npx tsx server/worker.ts` |
| Dockerfile target | `worker` (optional)        |

No public URL required.

---

## Environment variables (all 3 Railway services)

Set these on **Web**, **Socket**, and **Worker** (shared where noted):

```bash
NODE_ENV=production

# Supabase — direct/session URL (5432) for Railway
DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@[HOST]:5432/postgres?schema=public

# Auth — generate: openssl rand -base64 32
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://YOUR-WEB-DOMAIN
AUTH_SECRET=                    # same value as NEXTAUTH_SECRET (optional)
AUTH_URL=https://YOUR-WEB-DOMAIN

NEXT_PUBLIC_APP_URL=https://YOUR-WEB-DOMAIN
NEXT_PUBLIC_SOCKET_URL=https://YOUR-SOCKET-DOMAIN

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
REDIS_URL=                      # rediss://... if socket adapter needs it

# Worker (web service only)
WORKER_ENABLED=false

# Worker service only
WORKER_ENABLED=true
CRON_SECRET=                    # openssl rand -hex 16

# Socket service
SOCKET_PORT=3001

# Optional
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
LOG_LEVEL=info
```

**Web service only:** `WORKER_ENABLED=false`  
**Worker service only:** `WORKER_ENABLED=true`

---

## Part 4 — Verify

1. `https://YOUR-WEB-DOMAIN/api/health` → `200`
2. `https://YOUR-SOCKET-DOMAIN/health` → `200`
3. Login with seed user e.g. `admin@irrwms.gov.lk` / `Admin@1234` (if seeded)
4. Check Railway logs for worker cron and socket Redis connection errors

---

## Optional: Vercel for Next.js only

1. Import repo on Vercel.
2. **Build:** `prisma generate && next build` (default from `package.json`).
3. Use Supabase **pooled** `DATABASE_URL` (port `6543`).
4. Set `WORKER_ENABLED=false`.
5. Deploy **socket + worker** on Railway; set `NEXT_PUBLIC_SOCKET_URL` to the Railway socket URL.

Vercel env vars: same as web row above, plus pooled `DATABASE_URL`.

---

## Local dev fixes (before deploy)

```bash
cp .env.example .env
openssl rand -base64 32   # → NEXTAUTH_SECRET
```

Ensure `.env` exists; without `NEXTAUTH_SECRET`, auth returns `MissingSecret`.

---

## CI / schema updates

After changing `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name describe_change   # creates migration
git push
# On deploy or manually:
npx prisma migrate deploy
```

Or `npx prisma db push` for prototypes (not ideal for production teams).
