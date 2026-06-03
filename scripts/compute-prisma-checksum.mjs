#!/usr/bin/env node
/**
 * Computes Prisma migration checksum (SHA-256 hex) and updates
 * supabase/migrations/20250601000004_prisma_migration_history.sql
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const prismaMigration = join(
  root,
  "prisma/migrations/20250601000000_init/migration.sql",
);
const outFile = join(
  root,
  "supabase/migrations/20250601000004_prisma_migration_history.sql",
);

const sql = readFileSync(prismaMigration, "utf8");
const checksum = createHash("sha256").update(sql, "utf8").digest("hex");

const migration04 = `-- IrrWMS Supabase migration 04: Prisma migration history
-- Run after 01–03 when schema was applied via SQL Editor (not \`prisma migrate deploy\`).
-- Keeps \`prisma migrate deploy\` / \`prisma migrate status\` in sync on Supabase-hosted DBs.
-- Checksum auto-synced from prisma/migrations/20250601000000_init/migration.sql (npm run db:supabase:sync-checksum)

CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id" VARCHAR(36) PRIMARY KEY NOT NULL,
  "checksum" VARCHAR(64) NOT NULL,
  "finished_at" TIMESTAMPTZ,
  "migration_name" VARCHAR(255) NOT NULL,
  "logs" TEXT,
  "rolled_back_at" TIMESTAMPTZ,
  "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);

INSERT INTO "_prisma_migrations" (
  "id",
  "checksum",
  "finished_at",
  "migration_name",
  "logs",
  "rolled_back_at",
  "started_at",
  "applied_steps_count"
)
SELECT
  gen_random_uuid()::text,
  '${checksum}',
  NOW(),
  '20250601000000_init',
  NULL,
  NULL,
  NOW(),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations"
  WHERE "migration_name" = '20250601000000_init'
);
`;

writeFileSync(outFile, migration04, "utf8");
console.log(`Updated ${outFile}`);
console.log(`Checksum: ${checksum}`);
