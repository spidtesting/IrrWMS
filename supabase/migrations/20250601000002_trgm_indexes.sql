-- IrrWMS Supabase migration 02: trigram search indexes
-- Requires: 20250601000000_extensions.sql (pg_trgm)
-- Safe to re-run (idempotent).

CREATE INDEX IF NOT EXISTS "Item_nameEn_trgm_idx"
  ON "Item" USING gin ("nameEn" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Item_nameSi_trgm_idx"
  ON "Item" USING gin ("nameSi" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Category_nameEn_trgm_idx"
  ON "Category" USING gin ("nameEn" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Category_nameSi_trgm_idx"
  ON "Category" USING gin ("nameSi" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Supplier_nameEn_trgm_idx"
  ON "Supplier" USING gin ("nameEn" gin_trgm_ops);
