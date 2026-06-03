import type { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import {
  getCategoriesFromRecords,
  IMPORT_WAREHOUSE_CODE,
  IMPORT_WAREHOUSE_ID,
  type ParsedItemRecord,
} from "@/lib/import/parse-items-xlsx";

export type ItemsImportResult = {
  warehouseId: string;
  categoriesUpserted: number;
  itemsCreated: number;
  itemsUpdated: number;
  inventoryUpserted: number;
  skipped: number;
};

export async function importItemsIntoDatabase(
  prisma: PrismaClient,
  records: ParsedItemRecord[],
  options?: { warehouseId?: string },
): Promise<ItemsImportResult> {
  const categories = getCategoriesFromRecords(records);

  const warehouse =
    options?.warehouseId != null
      ? await prisma.warehouse.findUniqueOrThrow({ where: { id: options.warehouseId } })
      : await prisma.warehouse.upsert({
          where: { code: IMPORT_WAREHOUSE_CODE },
          create: {
            id: IMPORT_WAREHOUSE_ID,
            code: IMPORT_WAREHOUSE_CODE,
            nameEn: "Main Warehouse (Excel import)",
            nameSi: "ප්‍රධාන ගබඩාව (Excel)",
            location: "Imported from Items.xlsx",
            district: "Colombo",
            capacity: 50000,
            isActive: true,
          },
          update: {
            isActive: true,
          },
        });

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { code: cat.code },
      create: cat,
      update: { nameEn: cat.nameEn, nameSi: cat.nameSi },
    });
  }

  let itemsCreated = 0;
  let itemsUpdated = 0;
  let inventoryUpserted = 0;

  for (const row of records) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { code: row.categoryCode },
    });

    const reorderLevel = Math.max(1, Math.floor(row.currentStock * 0.2));
    const maxStock = Math.max(row.currentStock * 2, 100);

    const existing = await prisma.item.findUnique({ where: { itemCode: row.itemCode } });

    const item = await prisma.item.upsert({
      where: { itemCode: row.itemCode },
      create: {
        itemCode: row.itemCode,
        nameEn: row.nameEn,
        nameSi: row.nameSi,
        categoryId: category.id,
        unit: "pcs",
        unitSi: "ඒකක",
        minStock: 0,
        maxStock,
        reorderLevel,
        unitPrice: new Decimal(0),
        warehouseId: warehouse.id,
        barcode: row.barcode,
        dimensions: row.model,
        isActive: true,
      },
      update: {
        nameEn: row.nameEn,
        nameSi: row.nameSi,
        categoryId: category.id,
        barcode: row.barcode,
        dimensions: row.model,
        maxStock,
        reorderLevel,
        isActive: true,
        deletedAt: null,
      },
    });

    if (existing) itemsUpdated += 1;
    else itemsCreated += 1;

    await prisma.inventory.upsert({
      where: {
        itemId_warehouseId: {
          itemId: item.id,
          warehouseId: warehouse.id,
        },
      },
      create: {
        itemId: item.id,
        warehouseId: warehouse.id,
        currentStock: row.currentStock,
        reservedStock: 0,
        availableStock: row.currentStock,
      },
      update: {
        currentStock: row.currentStock,
        availableStock: row.currentStock,
      },
    });

    inventoryUpserted += 1;
  }

  return {
    warehouseId: warehouse.id,
    categoriesUpserted: categories.length,
    itemsCreated,
    itemsUpdated,
    inventoryUpserted,
    skipped: 0,
  };
}
