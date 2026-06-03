# Deploy IrrWMS on Railway

This app runs as **five Railway services**: Postgres, Redis, **web**, **socket**, and **worker**.

Railway does not support Docker multi-stage `--target`, so each process has its own Dockerfile:

| Service | Dockerfile          | Config file           |
| ------- | ------------------- | --------------------- |
| web     | `Dockerfile.web`    | `railway/web.toml`    |
| socket  | `Dockerfile.socket` | `railway/socket.toml` |
| worker  | `Dockerfile.worker` | `railway/worker.toml` |

## 1. Create the project

1. Open [railway.app](https://railway.app) → **New Project**.
2. **Add PostgreSQL** and **Redis** from the template gallery (or **+ New** → Database).
3. **+ New** → **GitHub Repo** → select `irrwms` (push your code first if needed).

## 2. Add three app services from the same repo

For each name below: **+ New** → **GitHub Repo** → same repository → rename the service.

### Web

- Service name: `web`
- **Settings** → **Config file**: `/railway/web.toml`
- **Settings** → **Networking** → **Generate Domain**
- **Variables** → connect **Postgres** and **Redis** (Reference Variable)
- Set shared vars from [`.env.railway.example`](../.env.railway.example)
- **Build** → add Docker build args (same values as public URLs):
  - `NEXT_PUBLIC_APP_URL` = your web domain
  - `NEXT_PUBLIC_SOCKET_URL` = socket domain (step below)
  - `NEXT_PUBLIC_APP_NAME` = `IrrWMS`

### Socket

- Service name: `socket`
- **Config file**: `/railway/socket.toml`
- **Networking** → **Generate Domain** (required for browsers)
- Reference **Postgres** + **Redis**
- Copy `NEXTAUTH_SECRET` from web (same value on all app services)

### Worker

- Service name: `worker`
- **Config file**: `/railway/worker.toml`
- No public domain
- Reference **Postgres** + **Redis**
- `WORKER_ENABLED=true`

## 3. Required environment variables

Set at **project** level (shared) or duplicate on web/socket/worker:

| Variable                 | Example                             |
| ------------------------ | ----------------------------------- |
| `NEXTAUTH_SECRET`        | `openssl rand -base64 32`           |
| `NEXTAUTH_URL`           | `https://web-xxx.up.railway.app`    |
| `NEXT_PUBLIC_APP_URL`    | same as `NEXTAUTH_URL`              |
| `NEXT_PUBLIC_SOCKET_URL` | `https://socket-xxx.up.railway.app` |
| `CRON_SECRET`            | random 16+ chars                    |
| `WORKER_ENABLED`         | `true` (worker only, or shared)     |
| `NODE_ENV`               | `production`                        |

`DATABASE_URL` and `REDIS_URL` come from the linked Postgres/Redis plugins.

After the first deploy, update URLs if Railway assigns new domains, then **redeploy web** so `NEXT_PUBLIC_*` build args match.

## 4. Database migrate & seed

Migrations run automatically on web deploy (`preDeployCommand` in `railway/web.toml`).

Seed once (Railway CLI):

```bash
npm i -g @railway/cli
railway login
railway link   # pick project + web service
railway run npm run db:seed
```

## 5. CLI deploy (optional)

```bash
./scripts/railway-deploy.sh
```

Or per service:

```bash
railway link --service web
railway up --detach
```

## 6. Verify

- Web: `https://<web-domain>/api/health`
- Socket: `https://<socket-domain>/health`
- Sign in and confirm real-time notifications connect (browser devtools → Network → WS)

## Troubleshooting

| Issue                  | Fix                                                                          |
| ---------------------- | ---------------------------------------------------------------------------- |
| Build uses wrong image | Ensure each service’s **config file** points to the correct `railway/*.toml` |
| Auth redirect errors   | `NEXTAUTH_URL` must equal the public web URL (https)                         |
| WebSockets fail        | Set `NEXT_PUBLIC_SOCKET_URL` to the **socket** service URL; redeploy **web** |
| Prisma migrate fails   | Check `DATABASE_URL` on web; view deploy logs for `preDeployCommand`         |
| Worker idle            | Confirm `WORKER_ENABLED=true` and Postgres is linked                         |
