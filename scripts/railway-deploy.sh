#!/usr/bin/env bash
# Deploy IrrWMS services to Railway (requires: railway login + linked project)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v railway >/dev/null 2>&1; then
  echo "Installing Railway CLI..."
  npm install -g @railway/cli
fi

if ! railway whoami >/dev/null 2>&1; then
  echo "Log in to Railway:"
  railway login
fi

echo ""
echo "IrrWMS Railway deploy"
echo "====================="
echo "Create the project in the dashboard first (see docs/deployment.md):"
echo "  - Postgres + Redis plugins"
echo "  - web, socket, worker services with railway/*.toml config paths"
echo ""

if [[ ! -f .railway/config.json ]]; then
  echo "Link this repo to your Railway project:"
  railway link
fi

deploy_service() {
  local name="$1"
  echo ""
  echo "Deploying service: $name"
  railway link --service "$name" 2>/dev/null || railway service "$name" 2>/dev/null || true
  railway up --detach
}

for svc in web socket worker; do
  if railway variables --service "$svc" >/dev/null 2>&1; then
    deploy_service "$svc"
  else
    echo "Skip $svc (service not found — create it in Railway dashboard)"
  fi
done

echo ""
echo "Done. Set domains and env vars from .env.railway.example if you have not already."
echo "Docs: docs/deployment.md"
