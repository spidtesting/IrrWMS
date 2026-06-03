# IrrWMS

Irrigation Department Warehouse Management System — Next.js, Prisma, PostgreSQL.

## Local development

```bash
cp .env.example .env
docker compose up -d postgres redis
npm install
npm run db:generate
npx prisma migrate deploy   # or apply Supabase SQL (see below)
npm run db:seed
npm run dev
```

Seed login: `admin@irrwms.gov.lk` / `Admin@1234`

## Supabase database

1. Run [`supabase/sql/apply_in_sql_editor.sql`](supabase/sql/apply_in_sql_editor.sql) in the Supabase SQL Editor.
2. Set `DATABASE_URL` and `DIRECT_URL` in `.env` (see [docs/supabase-setup.md](docs/supabase-setup.md)).
3. `npm run db:seed:remote`

## Deploy (Railway + Supabase)

See [docs/deployment.md](docs/deployment.md) and [railway.toml](railway.toml).
