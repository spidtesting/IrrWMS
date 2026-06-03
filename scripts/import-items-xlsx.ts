/**
 * Import items from Items.xlsx one row at a time (sequential, no batch skip).
 *
 * Usage:
 *   npx tsx scripts/import-items-xlsx.ts [path/to/Items.xlsx]
 */
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import * as fs from "node:fs";
import * as path from "node:path";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

const DEFAULT_XLSX =
  "/Users/ridmashehan/Library/Containers/net.whatsapp.WhatsApp/Data/tmp/documents/29A4C77A-6FC1-4F73-957D-D530E0045DF9/Items.xlsx";

const WAREHOUSE_CODE = "WH-CMB-01";
const DEFAULT_UNIT = "pcs";
const DEFAULT_UNIT_SI = "ක්";

type ExcelRow = {
  ItemID?: number | string;
  ItemName?: string;
  Category?: string;
  SerialNo?: string;
  Model?: string;
  CurrentStock?: number | string;
  Field1?: number | string;
};

function normalizeCategory(raw: unknown): string {
  const cleaned = String(raw ?? "")
    .trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, "");
  if (!cleaned || cleaned === ",") return "General";
  if (/^invetory$/i.test(cleaned) || /^inventory$/i.test(cleaned)) return "Inventory";
  if (/^stationary$/i.test(cleaned) || /^stationery$/i.test(cleaned)) return "Stationary";
  return cleaned;
}

function categoryCode(name: string): string {
  const slug = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  return `CAT-XLS-${slug || "GENERAL"}`;
}

function itemCodeFromId(id: number): string {
  return `XLS-${String(id).padStart(5, "0")}`;
}

function parseStock(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function parseItemId(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.floor(n);
}

function serialToBarcode(serial: unknown): string | null {
  const s = String(serial ?? "").trim();
  if (!s || s === "-" || s === "—") return null;
  return `SER-${s}`.slice(0, 64);
}

async function getOrCreateCategory(name: string) {
  const code = categoryCode(name);
  const existing = await prisma.category.findUnique({ where: { code } });
  if (existing) return existing;
  return prisma.category.create({
    data: {
      code,
      nameEn: name,
      nameSi: name,
    },
  });
}

async function main() {
  const filePath = path.resolve(process.argv[2] ?? DEFAULT_XLSX);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const warehouse = await prisma.warehouse.findUnique({
    where: { code: WAREHOUSE_CODE },
    include: {
      binLocations: { where: { isActive: true }, take: 1 },
    },
  });
  if (!warehouse) {
    console.error(
      `Warehouse ${WAREHOUSE_CODE} not found. Run npm run db:seed or db:migrate first.`,
    );
    process.exit(1);
  }

  const defaultBinId = warehouse.binLocations[0]?.id ?? null;

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]!];
  const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet, { defval: "" });

  console.log(`📂 ${filePath}`);
  console.log(`📦 Warehouse: ${warehouse.nameEn} (${warehouse.code})`);
  console.log(`📋 Rows in sheet: ${rows.length}`);
  console.log("⏳ Importing one row at a time…\n");

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index]!;
    const rowNum = index + 2; // Excel row (1-based header + data)
    const itemId = parseItemId(row.ItemID);
    const name = String(row.ItemName ?? "").trim();

    if (!itemId) {
      console.log(`⏭️  Row ${rowNum}: skip — invalid ItemID (${row.ItemID})`);
      skipped++;
      continue;
    }
    if (!name) {
      console.log(`⏭️  Row ${rowNum}: skip — empty ItemName (ItemID ${itemId})`);
      skipped++;
      continue;
    }

    const code = itemCodeFromId(itemId);
    const categoryName = normalizeCategory(row.Category);
    const stock = parseStock(row.CurrentStock);
    const barcode = serialToBarcode(row.SerialNo);
    const model = String(row.Model ?? "").trim();

    try {
      const existing = await prisma.item.findUnique({
        where: { itemCode: code },
        include: { inventory: { where: { warehouseId: warehouse.id } } },
      });

      if (existing) {
        const inv = existing.inventory[0];
        if (inv) {
          await prisma.inventory.update({
            where: { id: inv.id },
            data: {
              currentStock: stock,
              availableStock: stock - inv.reservedStock,
            },
          });
        } else {
          await prisma.inventory.create({
            data: {
              itemId: existing.id,
              warehouseId: warehouse.id,
              currentStock: stock,
              reservedStock: 0,
              availableStock: stock,
              binLocationId: defaultBinId,
            },
          });
        }
        console.log(`🔄 Row ${rowNum}: ${code} "${name}" — already exists, stock → ${stock}`);
        skipped++;
        continue;
      }

      const category = await getOrCreateCategory(categoryName);
      const reorderLevel = stock > 0 ? Math.max(1, Math.floor(stock * 0.1)) : 0;

      await prisma.$transaction(async (tx) => {
        const item = await tx.item.create({
          data: {
            itemCode: code,
            barcode,
            nameEn: name,
            nameSi: name,
            categoryId: category.id,
            unit: DEFAULT_UNIT,
            unitSi: DEFAULT_UNIT_SI,
            minStock: reorderLevel,
            maxStock: Math.max(stock * 2, reorderLevel * 5, 100),
            reorderLevel,
            unitPrice: new Decimal("0.00"),
            warehouseId: warehouse.id,
            dimensions: model || null,
            isActive: true,
          },
        });

        await tx.inventory.create({
          data: {
            itemId: item.id,
            warehouseId: warehouse.id,
            currentStock: stock,
            reservedStock: 0,
            availableStock: stock,
            binLocationId: defaultBinId,
            version: 0,
          },
        });
      });

      console.log(`✅ Row ${rowNum}: ${code} | ${categoryName} | "${name}" | stock ${stock}`);
      created++;
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`❌ Row ${rowNum}: ${code} "${name}" — ${msg}`);
    }
  }

  console.log("\n── Summary ──");
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed:  ${failed}`);
  console.log(`   Total:   ${rows.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
