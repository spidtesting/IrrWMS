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

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL is not set" >&2
  exit 1
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
  *)
    echo "Usage: $0 [dev|deploy|reset] [extra prisma args...]" >&2
    exit 1
    ;;
esac

echo "==> Running pg_trgm extension (if not exists)"
npx prisma db execute --stdin <<'SQL'
CREATE EXTENSION IF NOT EXISTS pg_trgm;
SQL

echo "==> Migration complete"
