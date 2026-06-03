# Deploy IrrWMS: Supabase + Railway (+ Upstash)

Production stack:

- **Supabase** — PostgreSQL ([setup guide](./supabase-setup.md))
- **Railway** — 3 services: web, socket, worker
- **Upstash** — Redis (rate limiting + socket pub/sub)

Alternative: **Vercel** for Next.js only + Railway for socket/worker ([below](#optional-vercel-for-nextjs-only)).

---

## Quick start order

1. [Supabase](./supabase-setup.md) — SQL Editor bundle + seed
2. [Upstash](#part-2--upstash-redis) — Redis credentials
3. [Railway](#part-3--railway-3-services) — deploy web → socket → worker
4. [Verify](#part-4--verify)

---

## Part 1 — Supabase database

**Full guide:** [docs/supabase-setup.md](./supabase-setup.md)

### SQL Editor (recommended)

```bash
npm run db:supabase:bundle
```

Paste [`supabase/sql/apply_in_sql_editor.sql`](../supabase/sql/apply_in_sql_editor.sql) into **Supabase → SQL Editor → Run**.

### Seed from your machine

```bash
npm run db:check-url
npm run db:generate
npm run db:seed
```

Set both `DIRECT_URL` and `DATABASE_URL` to Supabase **session** URI (port `5432`). See [.env.example](../.env.example).

### npm database scripts

| Script                              | Purpose                                |
| ----------------------------------- | -------------------------------------- |
| `npm run db:check-url`              | Validate connection strings            |
| `npm run db:supabase:bundle`        | Build SQL Editor bundle                |
| `npm run db:supabase:sync-checksum` | Update Prisma checksum in migration 04 |
| `npm run db:supabase:extras`        | Apply trgm + RLS via CLI               |
| `npm run db:seed`                   | Demo data                              |

---

## Part 2 — Upstash Redis

1. [console.upstash.com](https://console.upstash.com) → Create database.
2. Copy **REST URL** + **REST Token** → `UPSTASH_REDIS_REST_*`.
3. Copy **Redis URL** (`rediss://...`) → `REDIS_URL` for socket/worker.

---

## Part 3 — Railway (3 services)

Repo includes Railway config files:

| File                                            | Service       | Docker target |
| ----------------------------------------------- | ------------- | ------------- |
| [`railway.toml`](../railway.toml)               | Web (Next.js) | `runner`      |
| [`railway.socket.toml`](../railway.socket.toml) | Socket.io     | `socket`      |
| [`railway.worker.toml`](../railway.worker.toml) | Cron worker   | `worker`      |

### Setup

1. Push repo to GitHub.
2. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → select repo.
3. **Service 1 (web):** uses `railway.toml` by default. Enable **Public Networking**.
4. **Service 2 (socket):** **+ New Service** → same repo → **Settings → Config file** = `railway.socket.toml` → Public domain.
5. **Service 3 (worker):** **+ New Service** → **Config file** = `railway.worker.toml` (no public URL).

Non-Docker alternative for web: Build `npm ci && npx prisma generate && npm run build`, Start `npm start`.

### Shared environment variables

Set on each service (adjust domains):

```bash
NODE_ENV=production

DATABASE_URL=postgresql://postgres.[REF]:[ENCODED_PASSWORD]@[HOST]:5432/postgres?schema=public
DIRECT_URL=postgresql://postgres.[REF]:[ENCODED_PASSWORD]@[HOST]:5432/postgres?schema=public

NEXTAUTH_SECRET=                    # openssl rand -base64 32
AUTH_SECRET=                         # same as NEXTAUTH_SECRET
NEXTAUTH_URL=https://YOUR-WEB.up.railway.app
AUTH_URL=https://YOUR-WEB.up.railway.app
NEXT_PUBLIC_APP_URL=https://YOUR-WEB.up.railway.app
NEXT_PUBLIC_SOCKET_URL=https://YOUR-SOCKET.up.railway.app

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
REDIS_URL=rediss://...

SOCKET_PORT=3001
CRON_SECRET=                         # openssl rand -hex 16
LOG_LEVEL=info
```

| Service | `WORKER_ENABLED` |
| ------- | ---------------- |
| Web     | `false`          |
| Socket  | omit or `false`  |
| Worker  | `true`           |

Optional: `RESEND_*`, `CLOUDINARY_*` for email/uploads.

---

## Part 4 — Verify

| Check         | URL / action                                     |
| ------------- | ------------------------------------------------ |
| Web health    | `GET https://YOUR-WEB/api/health` → 200          |
| Socket health | `GET https://YOUR-SOCKET/health` → 200           |
| Login         | `admin@irrwms.gov.lk` / `Admin@1234` (if seeded) |
| Logs          | No Prisma connection or Redis errors on boot     |

---

## Optional: Vercel for Next.js only

1. Supabase **transaction pooler** `DATABASE_URL` (port `6543`, `pgbouncer=true`).
2. `WORKER_ENABLED=false`.
3. Deploy socket + worker on Railway; set `NEXT_PUBLIC_SOCKET_URL`.

---

## Local development

```bash
cp .env.example .env
openssl rand -base64 32   # NEXTAUTH_SECRET + AUTH_SECRET
npm run db:check-url
docker compose up -d postgres redis   # optional local DB
npm run dev:all
```

Without `NEXTAUTH_SECRET` (32+ chars), auth returns `MissingSecret`.

---

## Schema updates (CI / production)

```bash
npx prisma migrate dev --name describe_change
npm run db:supabase:sync-checksum   # if init migration changed
npm run db:supabase:bundle
git push
```

Production: apply new `supabase/migrations/*.sql` in SQL Editor, or run `npx prisma migrate deploy` from CI with `DIRECT_URL`.
