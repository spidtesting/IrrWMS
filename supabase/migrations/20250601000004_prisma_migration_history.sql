-- IrrWMS Supabase migration 04: Prisma migration history
-- Run after 01–03 when schema was applied via SQL Editor (not `prisma migrate deploy`).
-- Keeps `prisma migrate deploy` / `prisma migrate status` in sync on Supabase-hosted DBs.
-- Checksum matches prisma/migrations/20250601000000_init/migration.sql

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
  '19d79f121f4df296b92c19522f9aa65b3a596c44ae37cea6c98123993f2d4f80',
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
