/**
 * Rebuild pg_trgm search indexes for IrrWMS full-text search.
 * Run: npx tsx scripts/reindex.ts
 */

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

const TRIGRAM_INDEXES = [
  `CREATE EXTENSION IF NOT EXISTS pg_trgm`,
  `CREATE INDEX IF NOT EXISTS "Item_nameEn_trgm_idx" ON "Item" USING gin ("nameEn" gin_trgm_ops)`,
  `CREATE INDEX IF NOT EXISTS "Item_nameSi_trgm_idx" ON "Item" USING gin ("nameSi" gin_trgm_ops)`,
  `CREATE INDEX IF NOT EXISTS "Category_nameEn_trgm_idx" ON "Category" USING gin ("nameEn" gin_trgm_ops)`,
  `CREATE INDEX IF NOT EXISTS "Category_nameSi_trgm_idx" ON "Category" USING gin ("nameSi" gin_trgm_ops)`,
  `CREATE INDEX IF NOT EXISTS "Supplier_nameEn_trgm_idx" ON "Supplier" USING gin ("nameEn" gin_trgm_ops)`,
];

async function reindex(): Promise<void> {
  logger.info("Starting trigram index rebuild");

  for (const statement of TRIGRAM_INDEXES) {
    logger.info({ statement }, "Executing");
    await prisma.$executeRawUnsafe(statement);
  }

  logger.info("Trigram indexes rebuilt successfully");
}

reindex()
  .catch((error) => {
    logger.error({ err: error }, "Reindex failed");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
