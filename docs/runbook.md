# IrrWMS Operations Runbook

Operations guide for the Irrigation Department Warehouse Management System.

## Architecture

| Service         | Port   | Description                       |
| --------------- | ------ | --------------------------------- |
| `app`           | 3000   | Next.js web application           |
| `socket-server` | 3001   | Socket.io real-time notifications |
| `worker`        | —      | node-cron background jobs         |
| `postgres`      | 5432   | Primary database                  |
| `redis`         | 6379   | Socket adapter + caching          |
| `nginx`         | 80/443 | Reverse proxy                     |

## Local development

```bash
# Start infrastructure
docker compose up -d postgres redis

# Migrate & seed
npm run db:migrate
npm run db:seed

# Run all services
npm run dev:all
```

Individual processes:

```bash
npm run dev          # Next.js (port 3000)
npm run dev:socket   # Socket server (port 3001)
npm run dev:worker   # Cron worker
```

## Environment variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — min 32 characters
- `REDIS_URL` — Redis for socket adapter
- `RESEND_API_KEY` — email delivery
- `CRON_SECRET` — protect cron HTTP triggers (optional)

Set `SKIP_ENV_VALIDATION=true` only for CI or partial local setups.

## Database operations

### Migrate

```bash
chmod +x scripts/migrate.sh
./scripts/migrate.sh deploy    # production
./scripts/migrate.sh dev       # development with prompts
```

### Backup

```bash
chmod +x scripts/backup.sh
./scripts/backup.sh
# Backups stored in ./backups/ (14-day retention by default)
```

### Reindex search

```bash
npx tsx scripts/reindex.ts
```

Rebuilds pg_trgm GIN indexes on Item, Category, and Supplier name columns.

## Worker cron schedule

All times Asia/Colombo (UTC+5:30):

| Job               | Schedule      | Description                     |
| ----------------- | ------------- | ------------------------------- |
| KPI snapshot      | `05 0 * * *`  | Daily KPI upsert + alert emails |
| Low stock check   | `0 */6 * * *` | Every 6 hours                   |
| Task due alerts   | `0 * * * *`   | Hourly reminders                |
| Scheduled reports | `0 6 * * *`   | Daily stock report at 06:00     |

Disable worker: `WORKER_ENABLED=false`

## Socket server

Health check: `GET http://localhost:3001/health`

Clients connect with NextAuth session context. Rooms:

- `user:{userId}` — personal notifications
- `warehouse:{warehouseId}` — warehouse-wide events
- `role:{ROLE}` — role-based broadcasts

Cross-process events (worker → socket) use Redis pub/sub channel `irrwms:socket:broadcast`.

## Production deployment

```bash
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

CD pipeline (`.github/workflows/cd.yml`) builds three images:

- `runner` — Next.js app
- `worker` — cron worker
- `socket` — Socket.io server

Configure GitHub secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`

## Monitoring

- App health: `GET /api/health`
- Socket health: `GET :3001/health`
- Logs: structured JSON via Pino (`LOG_LEVEL=info`)
- Optional: wire `config/sentry.ts` with `@sentry/nextjs`

## Incident response

### Database connection failures

1. Check Postgres container: `docker compose ps postgres`
2. Verify `DATABASE_URL` credentials
3. Review connection pool exhaustion in app logs

### Redis / socket disconnects

1. Check Redis: `redis-cli ping`
2. Restart socket-server: `docker compose restart socket-server`
3. Clients auto-reconnect (5 attempts, 1 s delay)

### Worker not running jobs

1. Confirm `WORKER_ENABLED=true`
2. Check worker logs for cron registration message
3. Verify database connectivity from worker container

### Email delivery failures

1. Confirm `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
2. Check Resend dashboard for bounces
3. Password reset and alerts fail silently in logs — search for `Failed to send email`

## PWA / offline stock entry

- Service worker: `public/sw.js`
- Manifest: `public/manifest.json`
- Offline entries queued in IndexedDB, synced via Background Sync or manual flush

Register SW from app layout when dashboard pages are implemented.

## Security checklist

- [ ] Rotate `NEXTAUTH_SECRET` and `CRON_SECRET` for production
- [ ] Enable HTTPS via nginx SSL volume
- [ ] Restrict Postgres and Redis ports (not exposed in prod compose)
- [ ] Review role assignments quarterly
- [ ] Enable Sentry or equivalent APM

## Seed credentials (development only)

| Role        | Email               | Password   |
| ----------- | ------------------- | ---------- |
| Super Admin | super@irrwms.gov.lk | Admin@1234 |
| Admin       | admin@irrwms.gov.lk | Admin@1234 |
| Staff       | staff@irrwms.gov.lk | Admin@1234 |

**Never use seed passwords in production.**
