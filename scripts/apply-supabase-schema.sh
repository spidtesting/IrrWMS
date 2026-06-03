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

SQL_FILE="${1:-$ROOT_DIR/supabase/sql/apply_in_sql_editor.sql}"
DB_URL="${DIRECT_URL:-${DATABASE_URL:-}}"

if [[ -z "$DB_URL" ]]; then
  echo "ERROR: Set DIRECT_URL (recommended) or DATABASE_URL in .env" >&2
  exit 1
fi

if [[ "$DB_URL" == *"YOUR_DB_PASSWORD"* ]] || [[ "$DB_URL" == *"[PASSWORD]"* ]]; then
  echo "ERROR: Replace YOUR_DB_PASSWORD in .env with your Supabase database password." >&2
  echo "       Dashboard → Settings → Database" >&2
  exit 1
fi

if [[ ! -f "$SQL_FILE" ]]; then
  echo "ERROR: Missing $SQL_FILE — run: npm run db:supabase:bundle" >&2
  exit 1
fi

echo "==> Applying IrrWMS schema via psql"
echo "    File: $SQL_FILE"
psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$SQL_FILE"
echo "==> Schema applied successfully"
