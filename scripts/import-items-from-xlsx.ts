/**
 * Import Items.xlsx into IrrWMS (Prisma) and/or generate Supabase SQL.
 *
 * Usage:
 *   npx tsx scripts/import-items-from-xlsx.ts
 *   npx tsx scripts/import-items-from-xlsx.ts --sql-only
 *   npx tsx scripts/import-items-from-xlsx.ts --apply
 *   npx tsx scripts/import-items-from-xlsx.ts --file /path/to/Items.xlsx
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import {
  categorySqlId,
  getCategoriesFromRecords,
  IMPORT_WAREHOUSE_CODE,
  IMPORT_WAREHOUSE_ID,
  inventorySqlId,
  itemSqlId,
  parseItemsWorkbook,
  sqlEscape,
} from "../lib/import/parse-items-xlsx";
import { importItemsIntoDatabase } from "../lib/import/items-excel-import";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const defaultFile = join(root, "data/Items.xlsx");
const sqlOut = join(root, "supabase/sql/import_items_from_excel.sql");

const args = process.argv.slice(2);
const sqlOnly = args.includes("--sql-only");
const apply = args.includes("--apply") || (!sqlOnly && !args.includes("--sql-only"));
const fileArg = args.find((a) => a.startsWith("--file="));
const xlsxPath = fileArg ? fileArg.split("=")[1]! : defaultFile;

function generateSql(records: ReturnType<typeof parseItemsWorkbook>): string {
  const categories = getCategoriesFromRecords(records);
  const now = new Date().toISOString();
  const lines: string[] = [
    "-- IrrWMS: Import items from Items.xlsx",
    `-- Generated: ${now}`,
    `-- Rows: ${records.length}`,
    "-- Prerequisites: base schema applied (apply_in_sql_editor.sql)",
    "-- Safe to re-run: uses ON CONFLICT upserts",
    "",
    "BEGIN;",
    "",
    `-- Warehouse: ${IMPORT_WAREHOUSE_CODE}`,
    `INSERT INTO "Warehouse" (`,
    `  "id", "code", "nameEn", "nameSi", "location", "district", "capacity", "isActive", "createdAt", "updatedAt"`,
    `) VALUES (`,
    `  '${IMPORT_WAREHOUSE_ID}',`,
    `  '${IMPORT_WAREHOUSE_CODE}',`,
    `  'Main Warehouse (Excel import)',`,
    `  'ප්‍රධාන ගබඩාව (Excel)',`,
    `  'Imported from Items.xlsx',`,
    `  'Colombo',`,
    `  50000,`,
    `  true,`,
    `  NOW(),`,
    `  NOW()`,
    `) ON CONFLICT ("code") DO UPDATE SET`,
    `  "isActive" = true,`,
    `  "updatedAt" = NOW();`,
    "",
  ];

  for (const cat of categories) {
    const id = categorySqlId(cat.code);
    lines.push(
      `INSERT INTO "Category" ("id", "code", "nameEn", "nameSi")`,
      `VALUES ('${id}', '${cat.code}', '${sqlEscape(cat.nameEn)}', '${sqlEscape(cat.nameSi)}')`,
      `ON CONFLICT ("code") DO UPDATE SET "nameEn" = EXCLUDED."nameEn", "nameSi" = EXCLUDED."nameSi";`,
      "",
    );
  }

  for (const row of records) {
    const catId = categorySqlId(row.categoryCode);
    const itemId = itemSqlId(row.itemCode);
    const invId = inventorySqlId(row.itemCode);
    const reorder = Math.max(1, Math.floor(row.currentStock * 0.2));
    const maxStock = Math.max(row.currentStock * 2, 100);
    const barcode = row.barcode ? `'${sqlEscape(row.barcode)}'` : "NULL";
    const dimensions = row.model ? `'${sqlEscape(row.model)}'` : "NULL";

    lines.push(
      `INSERT INTO "Item" (`,
      `  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",`,
      `  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",`,
      `  "isActive", "createdAt", "updatedAt"`,
      `) VALUES (`,
      `  '${itemId}', '${row.itemCode}', ${barcode},`,
      `  '${sqlEscape(row.nameEn)}', '${sqlEscape(row.nameSi)}', '${catId}',`,
      `  'pcs', 'ඒකක', 0, ${maxStock}, ${reorder}, 0,`,
      `  '${IMPORT_WAREHOUSE_ID}', ${dimensions}, true, NOW(), NOW()`,
      `) ON CONFLICT ("itemCode") DO UPDATE SET`,
      `  "nameEn" = EXCLUDED."nameEn",`,
      `  "nameSi" = EXCLUDED."nameSi",`,
      `  "categoryId" = EXCLUDED."categoryId",`,
      `  "barcode" = EXCLUDED."barcode",`,
      `  "dimensions" = EXCLUDED."dimensions",`,
      `  "maxStock" = EXCLUDED."maxStock",`,
      `  "reorderLevel" = EXCLUDED."reorderLevel",`,
      `  "isActive" = true,`,
      `  "deletedAt" = NULL,`,
      `  "updatedAt" = NOW();`,
      "",
      `INSERT INTO "Inventory" (`,
      `  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"`,
      `) VALUES (`,
      `  '${invId}', '${itemId}', '${IMPORT_WAREHOUSE_ID}',`,
      `  ${row.currentStock}, 0, ${row.currentStock}, NOW()`,
      `) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET`,
      `  "currentStock" = EXCLUDED."currentStock",`,
      `  "availableStock" = EXCLUDED."availableStock",`,
      `  "updatedAt" = NOW();`,
      "",
    );
  }

  lines.push("COMMIT;", "");
  return lines.join("\n");
}

async function main() {
  console.log(`Reading ${xlsxPath}`);
  const buffer = readFileSync(xlsxPath);
  const records = parseItemsWorkbook(buffer);
  console.log(`Parsed ${records.length} items`);

  const sql = generateSql(records);
  writeFileSync(sqlOut, sql, "utf8");
  console.log(`Wrote ${sqlOut}`);

  if (sqlOnly) {
    console.log(
      "SQL only — paste into Supabase SQL Editor or run: psql $DATABASE_URL -f supabase/sql/import_items_from_excel.sql",
    );
    return;
  }

  if (apply) {
    if (process.env.DIRECT_URL) {
      process.env.DATABASE_URL = process.env.DIRECT_URL;
    }
    const prisma = new PrismaClient();
    try {
      const result = await importItemsIntoDatabase(prisma, records);
      console.log("Import complete:", result);
    } finally {
      await prisma.$disconnect();
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
