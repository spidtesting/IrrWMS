# Supabase setup (IrrWMS)

Project: **cakgsmzgdrsypwtmbmmw**  
Dashboard: https://supabase.com/dashboard/project/cakgsmzgdrsypwtmbmmw

## 1. Apply database schema (one-time)

1. Open **SQL Editor** → New query.
2. Paste the full contents of [`supabase/sql/apply_in_sql_editor.sql`](../supabase/sql/apply_in_sql_editor.sql).
3. Click **Run** (empty project only).

To regenerate that file after editing migrations:

```bash
npm run db:supabase:sync-checksum
```

## 2. Configure `.env`

1. Copy `.env.example` → `.env` if needed.
2. In Supabase → **Settings → Database**, copy the database password (not the anon JWT).
3. Replace `YOUR_DB_PASSWORD` in `DATABASE_URL` and `DIRECT_URL`.

Recommended URLs:

```env
DATABASE_URL=postgresql://postgres.cakgsmzgdrsypwtmbmmw:YOUR_DB_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?schema=public
DIRECT_URL=postgresql://postgres:YOUR_DB_PASSWORD@db.cakgsmzgdrsypwtmbmmw.supabase.co:5432/postgres?schema=public
```

Use the **Session pooler** host from your dashboard for `DATABASE_URL` (port 5432).

## 3. Seed data

```bash
npm run db:generate
npm run db:seed
```

Login: `admin@irrwms.gov.lk` / `Admin@1234`

## 4. Prisma CLI (alternative to SQL Editor)

If schema is not applied yet:

```bash
npx prisma migrate deploy
```

Requires `DIRECT_URL` set in `.env`.

## Security

- IrrWMS uses **Prisma + NextAuth**, not Supabase Auth or the Data API.
- Do not commit `.env`, `service_role`, or database passwords.
- `anon` / `service_role` JWT keys are not used as `DATABASE_URL`.
