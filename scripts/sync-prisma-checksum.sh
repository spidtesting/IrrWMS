#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATION_FILE="$ROOT_DIR/prisma/migrations/20250601000000_init/migration.sql"
HISTORY_FILE="$ROOT_DIR/supabase/migrations/20250601000004_prisma_migration_history.sql"

if [[ ! -f "$MIGRATION_FILE" ]]; then
  echo "ERROR: Missing $MIGRATION_FILE" >&2
  exit 1
fi

if command -v shasum >/dev/null 2>&1; then
  CHECKSUM=$(shasum -a 256 "$MIGRATION_FILE" | awk '{print $1}')
elif command -v sha256sum >/dev/null 2>&1; then
  CHECKSUM=$(sha256sum "$MIGRATION_FILE" | awk '{print $1}')
else
  echo "ERROR: shasum or sha256sum required" >&2
  exit 1
fi

echo "==> Prisma migration checksum: $CHECKSUM"

sed -i.bak "s/'PLACEHOLDER_CHECKSUM'/'$CHECKSUM'/g; s/'[a-f0-9]\{64\}'/'$CHECKSUM'/g" "$HISTORY_FILE"
rm -f "${HISTORY_FILE}.bak"

# Update bundled SQL if present
if [[ -f "$ROOT_DIR/supabase/sql/apply_in_sql_editor.sql" ]]; then
  sed -i.bak "s/'PLACEHOLDER_CHECKSUM'/'$CHECKSUM'/g" "$ROOT_DIR/supabase/sql/apply_in_sql_editor.sql" 2>/dev/null || true
  # Also replace any previous checksum in the bundle's migration 04 section
  perl -i -pe "s/'[a-f0-9]{64}'/'$CHECKSUM'/ if /migration_name.*20250601000000_init/../" \
    "$ROOT_DIR/supabase/sql/apply_in_sql_editor.sql" 2>/dev/null || true
  rm -f "${ROOT_DIR}/supabase/sql/apply_in_sql_editor.sql.bak" 2>/dev/null || true
fi

echo "==> Updated $HISTORY_FILE"
echo "==> Run: npm run db:supabase:bundle"
