# Deploy IrrWMS on Railway

Step-by-step guide to deploy on [railway.app](https://railway.app) with **Supabase** (database) and **Upstash** (Redis).

## Before you start

1. Code pushed to **GitHub** (Railway deploys from Git).
2. **Supabase** project with schema applied ([supabase-setup.md](./supabase-setup.md)).
3. Optional: Excel items imported (`npm run db:import-items:sql` in SQL Editor).

Generate secrets locally:

```bash
openssl rand -base64 32   # NEXTAUTH_SECRET / AUTH_SECRET
openssl rand -hex 16      # CRON_SECRET
```

---

## Option A — Web app only (fastest)

Good for first launch. Real-time socket and cron worker can be added later.

### 1. Create Railway project

1. Go to [railway.app/new](https://railway.app/new).
2. **Deploy from GitHub repo** → select `IrrWMS` (or your fork).
3. Railway creates one service using [`railway.toml`](../railway.toml).

### 2. Public URL

1. Open the **web** service → **Settings** → **Networking**.
2. Click **Generate Domain** (e.g. `irrwms-production.up.railway.app`).

### 3. Environment variables

**Variables** tab — add these (replace placeholders):

| Variable          | Value                                   |
| ----------------- | --------------------------------------- |
| `NODE_ENV`        | `production`                            |
| `DATABASE_URL`    | Supabase **session** URI, port **5432** |
| `DIRECT_URL`      | Same as `DATABASE_URL`                  |
| `AUTH_SECRET`     | **Required.** `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | **Same value as `AUTH_SECRET`**         |
| `NEXTAUTH_URL`    | `https://YOUR-DOMAIN.up.railway.app`    |
| `AUTH_URL`        | Same as `NEXTAUTH_URL`                  |

If deploy logs show `[auth][error] MissingSecret`, one or both secrets are missing or empty in **Variables** — add them and redeploy (no rebuild required).
| `NEXT_PUBLIC_APP_URL` | Same as `NEXTAUTH_URL` |
| `WORKER_ENABLED` | `false` |
| `SKIP_ENV_VALIDATION` | `false` (after all vars are set) |
| `UPSTASH_REDIS_REST_URL` | From Upstash (optional but recommended) |
| `UPSTASH_REDIS_REST_TOKEN` | From Upstash |
| `LOG_LEVEL` | `info` |

**Password tip:** URL-encode special characters in Supabase password (`@` → `%40`).

### 4. Deploy

Railway builds the Docker image (`runner` target) and deploys automatically.

Check logs for **Build succeeded** and **Deployment live**.

### Troubleshooting: healthcheck fails (`/api/health` → service unavailable)

| Symptom in build logs                                     | Fix                                                                                                                                                                                                       |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Final steps copy `server/`, `auth.ts` ( **socket** image) | Main app must use Docker target **`runner`**. In Railway → **Settings** → ensure config file is `railway.toml` (or set **Docker target** = `runner`). Do not use the socket image for the public web URL. |
| Build OK but healthcheck never passes                     | Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL` (see table above). Use Supabase session URL port **5432**.                                                                   |
| Socket service healthcheck                                | Use `railway.socket.toml`, path **`/health`**, and `REDIS_URL` (Upstash TCP URL).                                                                                                                         |

The Dockerfile ends with the **`runner`** stage so a plain `docker build` deploys the Next.js app even if Railway ignores `dockerTarget`.

### 5. Verify

- `https://YOUR-DOMAIN.up.railway.app/api/health` → `200`
- `https://YOUR-DOMAIN.up.railway.app/login` → login page
- Sign in: `admin@irrwms.gov.lk` / `Admin@1234` (if seeded)

---

## Option B — Full stack (web + socket + worker)

### Services

| #   | Config file              | Public URL?            |
| --- | ------------------------ | ---------------------- |
| 1   | `railway.toml` (default) | Yes — main app         |
| 2   | `railway.socket.toml`    | Yes — socket `/health` |
| 3   | `railway.worker.toml`    | No                     |

**Add socket & worker:**

1. In the same Railway project: **+ New** → **GitHub Repo** → same repository.
2. New service → **Settings** → set **Config file** to `railway.socket.toml`.
3. Repeat for `railway.worker.toml`.

### Extra variables

**Socket service** — same DB/Redis/Auth vars plus:

- `SOCKET_PORT` = `3001`
- `NEXT_PUBLIC_SOCKET_URL` = socket public URL (set on **web** service)

**Web service** — add:

- `NEXT_PUBLIC_SOCKET_URL` = `https://your-socket.up.railway.app`
- `WORKER_ENABLED` = `false`

**Worker service** — add:

- `WORKER_ENABLED` = `true`
- `CRON_SECRET` = your cron secret

Generate domains for **web** and **socket** before setting `NEXTAUTH_URL` and `NEXT_PUBLIC_SOCKET_URL`.

---

## Troubleshooting

| Issue                         | Fix                                                                     |
| ----------------------------- | ----------------------------------------------------------------------- |
| Build fails on env validation | Set all required vars, or temporarily `SKIP_ENV_VALIDATION=true`        |
| Health check fails            | Wait 2–3 min; check logs for Prisma/DB connection errors                |
| Login redirect loop           | `NEXTAUTH_URL` must match public URL exactly (https, no trailing slash) |
| 500 on API routes             | Check `DATABASE_URL` (use port 5432, not pooler 6543 on Railway)        |
| Push denied to GitHub         | Use a fork or get access to `spidtesting/IrrWMS`                        |

---

## CLI deploy (optional)

```bash
npm i -g @railway/cli
railway login
railway link
railway up
```

Set variables with `railway variables set KEY=value`.

---

See also: [deployment.md](./deployment.md), [supabase-setup.md](./supabase-setup.md).
