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

BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
FILENAME="irrwms_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL is not set" >&2
  exit 1
fi

echo "==> Backing up IrrWMS database to $BACKUP_DIR/$FILENAME"

pg_dump "$DATABASE_URL" | gzip > "$BACKUP_DIR/$FILENAME"

RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
find "$BACKUP_DIR" -name "irrwms_*.sql.gz" -mtime +"$RETENTION_DAYS" -delete 2>/dev/null || true

echo "==> Backup complete: $BACKUP_DIR/$FILENAME"
