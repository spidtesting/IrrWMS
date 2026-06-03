#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Stopping IrrWMS Postgres and removing corrupted volume"
docker compose down postgres 2>/dev/null || true
docker stop irrwms-postgres-1 2>/dev/null || true
docker rm irrwms-postgres-1 2>/dev/null || true
docker volume rm irrwms_postgres_data 2>/dev/null || true

echo "==> Starting fresh Postgres"
docker compose up -d postgres

echo "==> Waiting for Postgres to be ready"
for i in $(seq 1 30); do
  if docker compose exec -T postgres pg_isready -U irrwms -d irrwms >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

echo "==> Applying migrations"
npx prisma migrate deploy

echo "==> Seeding database"
npm run db:seed

echo "==> Done. Login: admin@irrwms.gov.lk / Admin@1234"
