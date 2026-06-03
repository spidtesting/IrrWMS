#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> IrrWMS database migration"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

MIGRATE_URL="${DIRECT_URL:-${DATABASE_URL:-}}"
if [[ -z "$MIGRATE_URL" ]]; then
  echo "ERROR: DIRECT_URL or DATABASE_URL is not set" >&2
  exit 1
fi

export DATABASE_URL="$MIGRATE_URL"
if [[ -n "${DIRECT_URL:-}" ]]; then
  export DIRECT_URL="$MIGRATE_URL"
fi

MODE="${1:-deploy}"

case "$MODE" in
  dev)
    npx prisma migrate dev "${@:2}"
    ;;
  deploy)
    npx prisma migrate deploy
    ;;
  reset)
    echo "WARNING: This will reset the database!"
    npx prisma migrate reset --force
    ;;
  extras)
    echo "==> Applying Supabase extras (trgm + RLS) via Prisma"
    npx prisma db execute --file supabase/migrations/20250601000002_trgm_indexes.sql
    npx prisma db execute --file supabase/migrations/20250601000003_rls_hardening.sql
    ;;
  *)
    echo "Usage: $0 [dev|deploy|reset|extras] [extra prisma args...]" >&2
    exit 1
    ;;
esac

echo "==> Migration complete"
