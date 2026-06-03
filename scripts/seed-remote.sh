#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [[ "${DATABASE_URL:-}" == *"YOUR_DB_PASSWORD"* ]]; then
  echo "ERROR: Replace YOUR_DB_PASSWORD in .env with your Supabase database password." >&2
  echo "       Dashboard → Settings → Database" >&2
  exit 1
fi

npm run db:generate
npm run db:seed
