# Supabase setup for IrrWMS

IrrWMS uses **Supabase only as PostgreSQL**. Authentication is **NextAuth** (not Supabase Auth).

## Prerequisites

- Supabase account and a new project
- Node.js 20+ locally
- `.env` copied from `.env.example`

## 1. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Choose region and set a strong database password (save it).
3. Wait until the project is **Active**.

## 2. Connection strings

**Project Settings → Database → Connection string → URI**

| Variable                  | Supabase mode               | Port   | Use for                                                        |
| ------------------------- | --------------------------- | ------ | -------------------------------------------------------------- |
| `DIRECT_URL`              | Session / Direct            | `5432` | SQL Editor follow-up seed, `prisma migrate`, `npm run db:seed` |
| `DATABASE_URL`            | Session / Direct on Railway | `5432` | Next.js app, socket, worker on Railway                         |
| `DATABASE_URL` (optional) | Transaction pooler          | `6543` | Vercel/serverless only                                         |

**Password encoding:** if the password contains `@`, `#`, `:`, or `%`, URL-encode it (`@` → `%40`).

Example `.env` (replace placeholders):

```env
DIRECT_URL=postgresql://postgres.abcdef:YOUR_ENCODED_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?schema=public&sslmode=require
DATABASE_URL=postgresql://postgres.abcdef:YOUR_ENCODED_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?schema=public&sslmode=require
```

Validate:

```bash
npm run db:check-url
```

## 3. Apply schema (SQL Editor — recommended)

Best for a **fresh empty** database.

1. Regenerate the bundle locally:

   ```bash
   npm run db:supabase:bundle
   ```

2. Open **Supabase Dashboard → SQL Editor → New query**.

3. Open [`supabase/sql/apply_in_sql_editor.sql`](../supabase/sql/apply_in_sql_editor.sql) in your editor, copy **the entire file**, paste into SQL Editor.

4. Click **Run**. It applies, in order:

   | File                                          | Purpose                         |
   | --------------------------------------------- | ------------------------------- |
   | `20250601000000_extensions.sql`               | `pg_trgm` extension             |
   | `20250601000001_initial_schema.sql`           | All tables, enums, indexes, FKs |
   | `20250601000002_trgm_indexes.sql`             | Trigram search indexes          |
   | `20250601000003_rls_hardening.sql`            | RLS + revoke anon/authenticated |
   | `20250601000004_prisma_migration_history.sql` | Prisma migration tracking row   |

5. Confirm in **Table Editor**: tables such as `User`, `Warehouse`, `Item` exist.

6. Verify Prisma history:

   ```sql
   SELECT migration_name, finished_at FROM "_prisma_migrations";
   ```

   Expected: `20250601000000_init`.

## 4. Seed demo data (local CLI)

```bash
npm run db:generate
npm run db:seed
```

Default login (from seed):

| Email                 | Password     |
| --------------------- | ------------ |
| `admin@irrwms.gov.lk` | `Admin@1234` |

## 5. Alternative: Prisma CLI path

If you prefer not to use the SQL Editor:

```bash
npm run db:check-url
npx prisma migrate deploy
npm run db:supabase:extras   # trgm indexes + RLS (if not in SQL bundle path)
npm run db:seed
```

## 6. Recovery (partial or failed migration)

**Development project (safe to wipe):**

1. SQL Editor:

   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON SCHEMA public TO public;
   ```

2. Re-run the full [`apply_in_sql_editor.sql`](../supabase/sql/apply_in_sql_editor.sql) bundle.

**Or** use Supabase **Database → Branches** reset on a dev branch.

Do **not** drop production schemas without a backup.

## 7. Schema changes later

1. Edit [`prisma/schema.prisma`](../prisma/schema.prisma).
2. `npx prisma migrate dev --name describe_change`
3. Add a new file under `supabase/migrations/` with the SQL delta (or export via `prisma migrate diff`).
4. `npm run db:supabase:sync-checksum` (if init migration changed)
5. `npm run db:supabase:bundle`
6. Apply **only the new** migration file in SQL Editor (production), or `npx prisma migrate deploy`.

Never hand-edit `supabase/sql/apply_in_sql_editor.sql`.

## Import Items.xlsx (258 items)

Your spreadsheet columns map to the database as follows:

| Excel        | Database                                      |
| ------------ | --------------------------------------------- |
| ItemID       | `itemCode` → `IMP-00001`, …                   |
| ItemName     | `nameEn`, `nameSi`                            |
| Category     | `Category` (Stationery / Inventory / General) |
| SerialNo     | `barcode` (if not `-`)                        |
| Model        | `dimensions`                                  |
| CurrentStock | `Inventory.currentStock`                      |

### Option A — SQL Editor (Supabase)

```bash
npm run db:import-items:sql
```

Paste [`supabase/sql/import_items_from_excel.sql`](../supabase/sql/import_items_from_excel.sql) into **SQL Editor → Run**.

Creates warehouse `WH-IMP-01` and upserts all items (safe to re-run).

### Option B — CLI (local / direct URL)

```bash
npm run db:import-items
```

### Option C — UI

**Inventory → Import Excel** (Manager+). Upload the same `.xlsx` format.

Source file is stored at [`data/Items.xlsx`](../data/Items.xlsx).

---

## Troubleshooting

| Error                                 | Fix                                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `invalid port number in database URL` | URL-encode password; remove `[ brackets ]` from `.env`; use port `5432` for direct        |
| `type "Role" already exists`          | DB not empty — run recovery section above                                                 |
| `prisma migrate` out of sync          | Re-run migration `04` or `npm run db:supabase:bundle` and execute file `20250601000004_*` |
| Auth `MissingSecret`                  | Set `NEXTAUTH_SECRET` (32+ chars): `openssl rand -base64 32`                              |

Next: [deployment.md](./deployment.md) for Railway hosting.
