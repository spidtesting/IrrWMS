# Supabase database setup

IrrWMS uses **Supabase for PostgreSQL only**. Authentication is **NextAuth** (Prisma `User` / `Session` tables), not Supabase Auth. The app connects with `DATABASE_URL`; do not use the Supabase anon key in the Next.js app.

## Architecture

| Component                   | Role                                                     |
| --------------------------- | -------------------------------------------------------- |
| `supabase/migrations/*.sql` | Ordered SQL applied in Dashboard or via Supabase CLI     |
| `prisma/schema.prisma`      | Source of truth for schema changes                       |
| `prisma/migrations/`        | Prisma migrate history (kept in sync via migration `04`) |
| `prisma/seed.ts`            | Demo data (bcrypt passwords; not suitable for raw SQL)   |

## New Supabase project

### 1. Create project

1. [supabase.com](https://supabase.com) → **New project**.
2. Save the database password.
3. **Settings → Database** → copy the **URI** (direct / session mode, port **5432**).

### 2. Apply schema (SQL Editor)

Use a **new empty** database. Do not re-run the full schema on an existing populated DB.

**Option A — one file (recommended for first setup)**

1. Open **SQL Editor** in the Supabase Dashboard.
2. Paste the contents of [`supabase/sql/apply_in_sql_editor.sql`](../supabase/sql/apply_in_sql_editor.sql).
3. Click **Run** and wait until it completes (~30s).

**Option B — step by step (easier to debug)**

Run each file in order from [`supabase/migrations/`](../supabase/migrations/):

| Order | File                                          |
| ----- | --------------------------------------------- |
| 1     | `20250601000000_extensions.sql`               |
| 2     | `20250601000001_initial_schema.sql`           |
| 3     | `20250601000002_trgm_indexes.sql`             |
| 4     | `20250601000003_rls_hardening.sql`            |
| 5     | `20250601000004_prisma_migration_history.sql` |

### 3. Local environment

```bash
cp .env.example .env
```

Set in `.env`:

```env
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?schema=public
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Seed demo data

```bash
npm install
npm run db:generate
npm run db:seed
```

Seed logins (password `Admin@1234`):

- `admin@irrwms.gov.lk`
- `staff@irrwms.gov.lk`

## Verify

### SQL (Dashboard → SQL Editor)

```sql
-- Extension for search
SELECT extname FROM pg_extension WHERE extname = 'pg_trgm';

-- Core tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY 1;

-- RLS enabled on app tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'User';

-- Prisma knows migrations were applied
SELECT migration_name, finished_at FROM "_prisma_migrations";
```

Expected: `pg_trgm` present, 30+ tables, `User.rowsecurity = true`, one row `20250601000000_init`.

### CLI (from project root)

```bash
npx prisma migrate status
```

Expected: **Database schema is up to date**.

```bash
npm run dev
curl -s http://localhost:3000/api/health
```

## Connection strings

| Runtime                                   | URL type           | Port | Notes                                    |
| ----------------------------------------- | ------------------ | ---- | ---------------------------------------- |
| Migrations, seed, Railway, worker, socket | Direct / Session   | 5432 | Full Postgres features                   |
| Vercel (serverless)                       | Transaction pooler | 6543 | Add `?pgbouncer=true&connection_limit=1` |

Do **not** put `SUPABASE_SERVICE_ROLE_KEY` or anon key in `NEXT_PUBLIC_*` variables.

## Regenerate bundled SQL

After editing files under `supabase/migrations/`:

```bash
npm run db:supabase:bundle
```

This updates [`supabase/sql/apply_in_sql_editor.sql`](../supabase/sql/apply_in_sql_editor.sql).

## Supabase CLI (optional)

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

CLI applies the same files under `supabase/migrations/`. You still need migration `04` for Prisma unless you run `prisma migrate deploy` instead.

## Schema changes later

1. Change [`prisma/schema.prisma`](../prisma/schema.prisma).
2. `npm run db:migrate` (creates a new Prisma migration).
3. Export SQL for Supabase, e.g.:

   ```bash
   npx prisma migrate diff \
     --from-migrations prisma/migrations \
     --to-schema-datamodel prisma/schema.prisma \
     --script > supabase/migrations/20250601000005_your_change.sql
   ```

4. `npm run db:supabase:bundle`
5. Run the new migration file in SQL Editor (or `supabase db push`) on staging/production.

## Prisma checksum (migration 04)

If you replace `prisma/migrations/20250601000000_init/migration.sql`, update the checksum in `20250601000004_prisma_migration_history.sql`:

```bash
shasum -a 256 prisma/migrations/20250601000000_init/migration.sql
```

## Troubleshooting

| Issue                                             | Fix                                                                                             |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `type "Role" already exists`                      | Schema already applied; skip file 01 or use a fresh project                                     |
| `prisma migrate status` wants to apply migrations | Run migration `04` in SQL Editor, or `npx prisma migrate resolve --applied 20250601000000_init` |
| Auth `MissingSecret`                              | Set `NEXTAUTH_SECRET` in `.env` (32+ chars)                                                     |
| Search slow / missing indexes                     | Re-run `20250601000002_trgm_indexes.sql` or `npx tsx scripts/reindex.ts`                        |

## Related docs

- [deployment.md](./deployment.md) — Railway / Vercel + env vars
- [runbook.md](./runbook.md) — backups, worker, operations
