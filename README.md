# IrrWMS

Irrigation Department Warehouse Management System — Next.js 14, Prisma, PostgreSQL (Supabase), NextAuth.

## Quick start (local)

```bash
cp .env.example .env
docker compose up -d postgres redis
npm install
npm run db:generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Login: `admin@irrwms.gov.lk` / `Admin@1234`

### Login fails with `pg_filenode.map` I/O error

Local Docker Postgres data is corrupted (often after disk was full). Restart **Docker Desktop**, then:

```bash
chmod +x scripts/reset-local-db.sh
npm run db:reset:local
```

Restart `npm run dev` and log in again.

## Supabase database (production)

Project: **cakgsmzgdrsypwtmbmmw**

1. Set `DATABASE_URL` and `DIRECT_URL` in `.env` (see [docs/supabase-setup.md](docs/supabase-setup.md)).
2. Apply schema (choose one):
   - **SQL Editor:** paste [supabase/sql/apply_in_sql_editor.sql](supabase/sql/apply_in_sql_editor.sql) and Run.
   - **CLI:** `npm run db:supabase:apply` (requires `psql` and `DIRECT_URL`).
3. Seed: `npm run db:seed:remote`

Regenerate SQL after migration changes:

```bash
npm run db:supabase:sync-checksum
```

## Railway deployment

Three services from one repo (Dockerfile targets: `runner`, `socket`, `worker`).

Copy variables from [railway.env.example](railway.env.example). Full guide: [docs/deployment.md](docs/deployment.md).

## Scripts

| Command                      | Description                     |
| ---------------------------- | ------------------------------- |
| `npm run dev:all`            | Next.js + socket + worker       |
| `npm run db:supabase:bundle` | Build `apply_in_sql_editor.sql` |
| `npm run db:supabase:apply`  | Apply schema via `psql`         |
| `npm run db:seed:remote`     | Seed remote Supabase DB         |

## Docs

- [Supabase setup](docs/supabase-setup.md)
- [Deployment (Railway)](docs/deployment.md)
- [Operations runbook](docs/runbook.md)
