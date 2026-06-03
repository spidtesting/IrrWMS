# IrrWMS

Irrigation Department Warehouse Management System — Next.js 14, Prisma, PostgreSQL, bilingual UI (EN/SI).

## Local development

```bash
cp .env.example .env
# Set NEXTAUTH_SECRET: openssl rand -base64 32
npm install
npm run db:check-url
docker compose up -d postgres redis   # optional
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev:all
```

Seed login: `admin@irrwms.gov.lk` / `Admin@1234`

## Production (Supabase + Railway)

| Guide                                            | Description                             |
| ------------------------------------------------ | --------------------------------------- |
| [docs/supabase-setup.md](docs/supabase-setup.md) | Online database + SQL Editor migrations |
| [docs/deployment.md](docs/deployment.md)         | Railway (web, socket, worker) + Upstash |

```bash
npm run db:supabase:bundle   # builds supabase/sql/apply_in_sql_editor.sql
```

## Database scripts

| Command                       | Purpose                                             |
| ----------------------------- | --------------------------------------------------- |
| `npm run db:check-url`        | Validate `DATABASE_URL` / `DIRECT_URL`              |
| `npm run db:supabase:bundle`  | SQL Editor bundle for Supabase                      |
| `npm run db:seed`             | Demo data                                           |
| `npm run db:studio`           | Prisma Studio                                       |
| `npm run db:import-items`     | Import `data/Items.xlsx` into DB (Prisma)           |
| `npm run db:import-items:sql` | Generate `supabase/sql/import_items_from_excel.sql` |

See [docs/runbook.md](docs/runbook.md) for operations.
