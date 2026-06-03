-- IrrWMS: Import items from Items.xlsx
-- Generated: 2026-06-03T03:09:17.109Z
-- Rows: 258
-- Prerequisites: base schema applied (apply_in_sql_editor.sql)
-- Safe to re-run: uses ON CONFLICT upserts

BEGIN;

-- Warehouse: WH-IMP-01
INSERT INTO "Warehouse" (
  "id", "code", "nameEn", "nameSi", "location", "district", "capacity", "isActive", "createdAt", "updatedAt"
) VALUES (
  'climp000000000000000wh01',
  'WH-IMP-01',
  'Main Warehouse (Excel import)',
  'ප්‍රධාන ගබඩාව (Excel)',
  'Imported from Items.xlsx',
  'Colombo',
  50000,
  true,
  NOW(),
  NOW()
) ON CONFLICT ("code") DO UPDATE SET
  "isActive" = true,
  "updatedAt" = NOW();

INSERT INTO "Category" ("id", "code", "nameEn", "nameSi")
VALUES ('climpcat00000000000001', 'CAT-STATIONERY', 'Stationery', 'ලිපිද්‍රව්‍ය')
ON CONFLICT ("code") DO UPDATE SET "nameEn" = EXCLUDED."nameEn", "nameSi" = EXCLUDED."nameSi";

INSERT INTO "Category" ("id", "code", "nameEn", "nameSi")
VALUES ('climpcat00000000000003', 'CAT-GENERAL', 'General', 'සාමාන්‍ය')
ON CONFLICT ("code") DO UPDATE SET "nameEn" = EXCLUDED."nameEn", "nameSi" = EXCLUDED."nameSi";

INSERT INTO "Category" ("id", "code", "nameEn", "nameSi")
VALUES ('climpcat00000000000002', 'CAT-INVENTORY', 'Inventory supplies', 'ඉන්වෙන්ටරි සැපයුම්')
ON CONFLICT ("code") DO UPDATE SET "nameEn" = EXCLUDED."nameEn", "nameSi" = EXCLUDED."nameSi";

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000001', 'IMP-00001', NULL,
  'Letter Head', 'Letter Head', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 4, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000001', 'climpi00000000000001', 'climp000000000000000wh01',
  22, 0, 22, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000002', 'IMP-00002', NULL,
  'CR  පිටු 80', 'CR  පිටු 80', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 574, 57, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000002', 'climpi00000000000002', 'climp000000000000000wh01',
  287, 0, 287, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000003', 'IMP-00003', NULL,
  'CR පිටු  120', 'CR පිටු  120', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 9, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000003', 'climpi00000000000003', 'climp000000000000000wh01',
  48, 0, 48, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000004', 'IMP-00004', NULL,
  'CR පිටු 160', 'CR පිටු 160', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 102, 10, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000004', 'climpi00000000000004', 'climp000000000000000wh01',
  51, 0, 51, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000005', 'IMP-00005', NULL,
  'CR ටු 200', 'CR ටු 200', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 156, 15, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000005', 'climpi00000000000005', 'climp000000000000000wh01',
  78, 0, 78, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000006', 'IMP-00006', NULL,
  'Note Book', 'Note Book', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 7, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000006', 'climpi00000000000006', 'climp000000000000000wh01',
  36, 0, 36, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000007', 'IMP-00007', NULL,
  'A4 පැකට්', 'A4 පැකට්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 234, 23, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000007', 'climpi00000000000007', 'climp000000000000000wh01',
  117, 0, 117, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000008', 'IMP-00008', NULL,
  'A3 පැකට්', 'A3 පැකට්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 2, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000008', 'climpi00000000000008', 'climp000000000000000wh01',
  11, 0, 11, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000009', 'IMP-00009', NULL,
  'Half Sheet', 'Half Sheet', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 4, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000009', 'climpi00000000000009', 'climp000000000000000wh01',
  21, 0, 21, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000010', 'IMP-00010', NULL,
  'Legal Sheet', 'Legal Sheet', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 2, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000010', 'climpi00000000000010', 'climp000000000000000wh01',
  13, 0, 13, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000011', 'IMP-00011', NULL,
  'නිල් පෑන්', 'නිල් පෑන්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 354, 35, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000011', 'climpi00000000000011', 'climp000000000000000wh01',
  177, 0, 177, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000012', 'IMP-00012', NULL,
  'කලු පැන්', 'කලු පැන්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 106, 10, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000012', 'climpi00000000000012', 'climp000000000000000wh01',
  53, 0, 53, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000013', 'IMP-00013', NULL,
  'රතු පෑන්', 'රතු පෑන්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 1356, 135, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000013', 'climpi00000000000013', 'climp000000000000000wh01',
  678, 0, 678, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000014', 'IMP-00014', NULL,
  'Pen', 'Pen', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 2, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000014', 'climpi00000000000014', 'climp000000000000000wh01',
  11, 0, 11, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000015', 'IMP-00015', NULL,
  'Marker Pen', 'Marker Pen', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000015', 'climpi00000000000015', 'climp000000000000000wh01',
  5, 0, 5, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000016', 'IMP-00016', NULL,
  'Highlight Pen', 'Highlight Pen', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 5, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000016', 'climpi00000000000016', 'climp000000000000000wh01',
  25, 0, 25, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000017', 'IMP-00017', NULL,
  'Platignum', 'Platignum', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000017', 'climpi00000000000017', 'climp000000000000000wh01',
  5, 0, 5, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000018', 'IMP-00018', NULL,
  'පැන්සල්', 'පැන්සල්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 144, 14, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000018', 'climpi00000000000018', 'climp000000000000000wh01',
  72, 0, 72, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000019', 'IMP-00019', NULL,
  'ලියුම් නවර 3.5x6', 'ලියුම් නවර 3.5x6', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 3444, 344, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000019', 'climpi00000000000019', 'climp000000000000000wh01',
  1722, 0, 1722, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000020', 'IMP-00020', NULL,
  'ලියුම් කවර 9 x 9', 'ලියුම් කවර 9 x 9', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 9580, 958, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000020', 'climpi00000000000020', 'climp000000000000000wh01',
  4790, 0, 4790, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000021', 'IMP-00021', NULL,
  'ලියුම් කවර 10x7', 'ලියුම් කවර 10x7', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 2304, 230, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000021', 'climpi00000000000021', 'climp000000000000000wh01',
  1152, 0, 1152, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000022', 'IMP-00022', NULL,
  'ලියුම් කවර10x15', 'ලියුම් කවර10x15', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 2208, 220, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000022', 'climpi00000000000022', 'climp000000000000000wh01',
  1104, 0, 1104, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000023', 'IMP-00023', NULL,
  'ලියුම් කවර  12x10', 'ලියුම් කවර  12x10', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 1098, 109, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000023', 'climpi00000000000023', 'climp000000000000000wh01',
  549, 0, 549, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000024', 'IMP-00024', NULL,
  'ලියුම් කවර 12x15', 'ලියුම් කවර 12x15', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000024', 'climpi00000000000024', 'climp000000000000000wh01',
  0, 0, 0, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000025', 'IMP-00025', NULL,
  'මකන', 'මකන', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 126, 12, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000025', 'climpi00000000000025', 'climp000000000000000wh01',
  63, 0, 63, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000026', 'IMP-00026', NULL,
  'පැන්සල් කටර්', 'පැන්සල් කටර්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000026', 'climpi00000000000026', 'climp000000000000000wh01',
  8, 0, 8, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000027', 'IMP-00027', NULL,
  'අඩිරූල්', 'අඩිරූල්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 7, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000027', 'climpi00000000000027', 'climp000000000000000wh01',
  39, 0, 39, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000028', 'IMP-00028', NULL,
  'කොඩි තීරු', 'කොඩි තීරු', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 162, 16, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000028', 'climpi00000000000028', 'climp000000000000000wh01',
  81, 0, 81, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000029', 'IMP-00029', NULL,
  'කොඩි 3x3', 'කොඩි 3x3', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 162, 16, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000029', 'climpi00000000000029', 'climp000000000000000wh01',
  81, 0, 81, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000030', 'IMP-00030', NULL,
  'ඇල්පෙනති', 'ඇල්පෙනති', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000030', 'climpi00000000000030', 'climp000000000000000wh01',
  7, 0, 7, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000031', 'IMP-00031', NULL,
  'පයිල් කටු', 'පයිල් කටු', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 238, 23, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000031', 'climpi00000000000031', 'climp000000000000000wh01',
  119, 0, 119, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000032', 'IMP-00032', NULL,
  'ස්ටෙප්ලර් කටු', 'ස්ටෙප්ලර් කටු', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 6, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000032', 'climpi00000000000032', 'climp000000000000000wh01',
  34, 0, 34, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000033', 'IMP-00033', NULL,
  'බුල්ඩො', 'බුල්ඩො', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 324, 32, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000033', 'climpi00000000000033', 'climp000000000000000wh01',
  162, 0, 162, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000034', 'IMP-00034', NULL,
  'ගම් බයින්ඩිං', 'ගම් බයින්ඩිං', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000034', 'climpi00000000000034', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000035', 'IMP-00035', NULL,
  'ගම් ලික්විඩ්', 'ගම් ලික්විඩ්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000035', 'climpi00000000000035', 'climp000000000000000wh01',
  6, 0, 6, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000036', 'IMP-00036', NULL,
  'කතුරු', 'කතුරු', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000036', 'climpi00000000000036', 'climp000000000000000wh01',
  5, 0, 5, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000037', 'IMP-00037', NULL,
  'ටිපෙක්ස්', 'ටිපෙක්ස්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000037', 'climpi00000000000037', 'climp000000000000000wh01',
  4, 0, 4, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000038', 'IMP-00038', NULL,
  'පයිල් කවර සාමාන්‍ය', 'පයිල් කවර සාමාන්‍ය', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 1310, 131, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000038', 'climpi00000000000038', 'climp000000000000000wh01',
  655, 0, 655, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000039', 'IMP-00039', NULL,
  'කොල පාට පයිල්', 'කොල පාට පයිල්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 1460, 146, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000039', 'climpi00000000000039', 'climp000000000000000wh01',
  730, 0, 730, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000040', 'IMP-00040', NULL,
  'කහපාට පයිල් කවර', 'කහපාට පයිල් කවර', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 1272, 127, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000040', 'climpi00000000000040', 'climp000000000000000wh01',
  636, 0, 636, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000041', 'IMP-00041', NULL,
  'දම්පාට පයිල් කවර', 'දම්පාට පයිල් කවර', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000041', 'climpi00000000000041', 'climp000000000000000wh01',
  0, 0, 0, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000042', 'IMP-00042', NULL,
  'රෝස පාට පයිල් කවර', 'රෝස පාට පයිල් කවර', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 592, 59, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000042', 'climpi00000000000042', 'climp000000000000000wh01',
  296, 0, 296, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000043', 'IMP-00043', NULL,
  'බොක්ස් පයිල්', 'බොක්ස් පයිල්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 5, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000043', 'climpi00000000000043', 'climp000000000000000wh01',
  25, 0, 25, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000044', 'IMP-00044', NULL,
  'ලිපිගොනු රඳවන', 'ලිපිගොනු රඳවන', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000044', 'climpi00000000000044', 'climp000000000000000wh01',
  5, 0, 5, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000045', 'IMP-00045', NULL,
  'INK PAD', 'INK PAD', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 2, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000045', 'climpi00000000000045', 'climp000000000000000wh01',
  10, 0, 10, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000046', 'IMP-00046', NULL,
  'INL BOTTLE', 'INL BOTTLE', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 2, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000046', 'climpi00000000000046', 'climp000000000000000wh01',
  10, 0, 10, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000047', 'IMP-00047', NULL,
  'සෙලෝ ටේප්  අඟල් 1', 'සෙලෝ ටේප්  අඟල් 1', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 7, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000047', 'climpi00000000000047', 'climp000000000000000wh01',
  36, 0, 36, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000048', 'IMP-00048', NULL,
  'සෙලෝ ටේප් අඟල් 2', 'සෙලෝ ටේප් අඟල් 2', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 6, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000048', 'climpi00000000000048', 'climp000000000000000wh01',
  34, 0, 34, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000049', 'IMP-00049', NULL,
  'සෙලෝ ටේප් වෙනත්', 'සෙලෝ ටේප් වෙනත්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000049', 'climpi00000000000049', 'climp000000000000000wh01',
  8, 0, 8, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000050', 'IMP-00050', NULL,
  'බයින්ඩං ටේප්', 'බයින්ඩං ටේප්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 7, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000050', 'climpi00000000000050', 'climp000000000000000wh01',
  39, 0, 39, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000051', 'IMP-00051', NULL,
  'වාර්නිෂ් කොල පාට', 'වාර්නිෂ් කොල පාට', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 200, 20, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000051', 'climpi00000000000051', 'climp000000000000000wh01',
  100, 0, 100, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000052', 'IMP-00052', NULL,
  'වාර්නිෂ් කහපාට', 'වාර්නිෂ් කහපාට', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 226, 22, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000052', 'climpi00000000000052', 'climp000000000000000wh01',
  113, 0, 113, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000053', 'IMP-00053', NULL,
  'වාර්නිෂ් දම්පාට', 'වාර්නිෂ් දම්පාට', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 252, 25, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000053', 'climpi00000000000053', 'climp000000000000000wh01',
  126, 0, 126, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000054', 'IMP-00054', NULL,
  'වාර්නිෂ් රෝස පාට', 'වාර්නිෂ් රෝස පාට', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 246, 24, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000054', 'climpi00000000000054', 'climp000000000000000wh01',
  123, 0, 123, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000055', 'IMP-00055', NULL,
  'කාබන් කොල ONE SIDE', 'කාබන් කොල ONE SIDE', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 9, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000055', 'climpi00000000000055', 'climp000000000000000wh01',
  49, 0, 49, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000056', 'IMP-00056', NULL,
  'කාබන් කොල BOTH SIDE', 'කාබන් කොල BOTH SIDE', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000056', 'climpi00000000000056', 'climp000000000000000wh01',
  5, 0, 5, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000057', 'IMP-00057', NULL,
  'AA BATTERY', 'AA BATTERY', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 3, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000057', 'climpi00000000000057', 'climp000000000000000wh01',
  15, 0, 15, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000058', 'IMP-00058', NULL,
  'AAA BATTERY', 'AAA BATTERY', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 2, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000058', 'climpi00000000000058', 'climp000000000000000wh01',
  10, 0, 10, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000059', 'IMP-00059', NULL,
  'පොලිතින් (m)', 'පොලිතින් (m)', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 200, 20, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000059', 'climpi00000000000059', 'climp000000000000000wh01',
  100, 0, 100, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000060', 'IMP-00060', NULL,
  'මවුස් පෑඩ්', 'මවුස් පෑඩ්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000060', 'climpi00000000000060', 'climp000000000000000wh01',
  8, 0, 8, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000061', 'IMP-00061', NULL,
  'බිත්ති ඔරලෝසු', 'බිත්ති ඔරලෝසු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000061', 'climpi00000000000061', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000062', 'IMP-00062', NULL,
  'මැනිලා කොල', 'මැනිලා කොල', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 1000, 100, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000062', 'climpi00000000000062', 'climp000000000000000wh01',
  500, 0, 500, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000063', 'IMP-00063', NULL,
  'A4 කොල දම් පාට', 'A4 කොල දම් පාට', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 180, 18, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000063', 'climpi00000000000063', 'climp000000000000000wh01',
  90, 0, 90, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000064', 'IMP-00064', NULL,
  'A4 කොල කොල පාට', 'A4 කොල කොල පාට', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 140, 14, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000064', 'climpi00000000000064', 'climp000000000000000wh01',
  70, 0, 70, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000065', 'IMP-00065', NULL,
  'A4 කොල ලා නිල් පාට', 'A4 කොල ලා නිල් පාට', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 180, 18, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000065', 'climpi00000000000065', 'climp000000000000000wh01',
  90, 0, 90, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000066', 'IMP-00066', NULL,
  'A4 කොල කහ පාට', 'A4 කොල කහ පාට', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000066', 'climpi00000000000066', 'climp000000000000000wh01',
  0, 0, 0, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000067', 'IMP-00067', NULL,
  'A4 කොල රෝස පාට', 'A4 කොල රෝස පාට', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 448, 44, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000067', 'climpi00000000000067', 'climp000000000000000wh01',
  224, 0, 224, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000068', 'IMP-00068', NULL,
  'A4 කොල තැඹිලි පාට', 'A4 කොල තැඹිලි පාට', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 862, 86, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000068', 'climpi00000000000068', 'climp000000000000000wh01',
  431, 0, 431, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000069', 'IMP-00069', NULL,
  'CONCUURA SHEET', 'CONCUURA SHEET', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 182, 18, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000069', 'climpi00000000000069', 'climp000000000000000wh01',
  91, 0, 91, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000070', 'IMP-00070', NULL,
  'ජල සාම්පල් බෝතල්', 'ජල සාම්පල් බෝතල්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 5, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000070', 'climpi00000000000070', 'climp000000000000000wh01',
  29, 0, 29, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000071', 'IMP-00071', NULL,
  'මල්ටි ප්ලග් සහිත කෝඩ්', 'මල්ටි ප්ලග් සහිත කෝඩ්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000071', 'climpi00000000000071', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000072', 'IMP-00072', NULL,
  'පංචර්', 'පංචර්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000072', 'climpi00000000000072', 'climp000000000000000wh01',
  5, 0, 5, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000073', 'IMP-00073', NULL,
  'VING PIN', 'VING PIN', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000073', 'climpi00000000000073', 'climp000000000000000wh01',
  9, 0, 9, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000074', 'IMP-00074', NULL,
  'CD', 'CD', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 5, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000074', 'climpi00000000000074', 'climp000000000000000wh01',
  28, 0, 28, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000075', 'IMP-00075', NULL,
  'GIS CLEAR BAG', 'GIS CLEAR BAG', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 356, 35, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000075', 'climpi00000000000075', 'climp000000000000000wh01',
  178, 0, 178, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000076', 'IMP-00076', NULL,
  'TRANCEPARANCE SHEET', 'TRANCEPARANCE SHEET', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 200, 20, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000076', 'climpi00000000000076', 'climp000000000000000wh01',
  100, 0, 100, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000077', 'IMP-00077', NULL,
  'BLACK COVER', 'BLACK COVER', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 200, 20, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000077', 'climpi00000000000077', 'climp000000000000000wh01',
  100, 0, 100, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000078', 'IMP-00078', NULL,
  'COMPUTER SHEET 2 PLY1 9.5X11', 'COMPUTER SHEET 2 PLY1 9.5X11', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000078', 'climpi00000000000078', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000079', 'IMP-00079', NULL,
  'COMPUTER SHEET 1 PLY 15X11', 'COMPUTER SHEET 1 PLY 15X11', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000079', 'climpi00000000000079', 'climp000000000000000wh01',
  6, 0, 6, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000080', 'IMP-00080', NULL,
  'පෞද්ගලික ලිපි ගොනු', 'පෞද්ගලික ලිපි ගොනු', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 120, 12, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000080', 'climpi00000000000080', 'climp000000000000000wh01',
  60, 0, 60, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000081', 'IMP-00081', NULL,
  'කැල්කියුලේටර්', 'කැල්කියුලේටර්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 2, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000081', 'climpi00000000000081', 'climp000000000000000wh01',
  13, 0, 13, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000082', 'IMP-00082', NULL,
  'ස්ටෙප්ලර් යන්ත්‍ර', 'ස්ටෙප්ලර් යන්ත්‍ර', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000082', 'climpi00000000000082', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000083', 'IMP-00083', NULL,
  'PEN HOLDER', 'PEN HOLDER', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 6, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000083', 'climpi00000000000083', 'climp000000000000000wh01',
  33, 0, 33, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000084', 'IMP-00084', NULL,
  'නාම පුවරු - නිලධාරි', 'නාම පුවරු - නිලධාරි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 3, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000084', 'climpi00000000000084', 'climp000000000000000wh01',
  19, 0, 19, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000086', 'IMP-00086', NULL,
  'PAPER WEIGHT', 'PAPER WEIGHT', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 5, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000086', 'climpi00000000000086', 'climp000000000000000wh01',
  29, 0, 29, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000087', 'IMP-00087', NULL,
  'PEN DRIVE', 'PEN DRIVE', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000087', 'climpi00000000000087', 'climp000000000000000wh01',
  6, 0, 6, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000088', 'IMP-00088', NULL,
  'DUSTBIN', 'DUSTBIN', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 4, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000088', 'climpi00000000000088', 'climp000000000000000wh01',
  22, 0, 22, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000089', 'IMP-00089', NULL,
  'PHOTOCOPY TONER - KYOCERA ECOSYS', 'PHOTOCOPY TONER - KYOCERA ECOSYS', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000089', 'climpi00000000000089', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000090', 'IMP-00090', NULL,
  'TOSHIBA TONER', 'TOSHIBA TONER', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000090', 'climpi00000000000090', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000091', 'IMP-00091', NULL,
  'EPSON LQ - 2190 REBBON  (DOT PRINTER)', 'EPSON LQ - 2190 REBBON  (DOT PRINTER)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000091', 'climpi00000000000091', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000092', 'IMP-00092', NULL,
  'EPSON LQ -310 RIBBON', 'EPSON LQ -310 RIBBON', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000092', 'climpi00000000000092', 'climp000000000000000wh01',
  0, 0, 0, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000093', 'IMP-00093', NULL,
  'EPSON  L- 130 (INK BOTTEL', 'EPSON  L- 130 (INK BOTTEL', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000093', 'climpi00000000000093', 'climp000000000000000wh01',
  0, 0, 0, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000094', 'IMP-00094', NULL,
  'BROTHER HL 6200 DW TONER', 'BROTHER HL 6200 DW TONER', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000094', 'climpi00000000000094', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000095', 'IMP-00095', NULL,
  'BROTHER 2560XL', 'BROTHER 2560XL', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000095', 'climpi00000000000095', 'climp000000000000000wh01',
  0, 0, 0, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000096', 'IMP-00096', NULL,
  'KYOCERA TONER  TK-7109 ( ඉවත් කරන ලද මැෂින් එක)', 'KYOCERA TONER  TK-7109 ( ඉවත් කරන ලද මැෂින් එක)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000096', 'climpi00000000000096', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000097', 'IMP-00097', NULL,
  'FAX TONER', 'FAX TONER', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000097', 'climpi00000000000097', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000098', 'IMP-00098', NULL,
  'WIFI ADAPTER', 'WIFI ADAPTER', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000098', 'climpi00000000000098', 'climp000000000000000wh01',
  0, 0, 0, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000099', 'IMP-00099', NULL,
  'ටැග් නුල්', 'ටැග් නුල්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 2872, 287, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000099', 'climpi00000000000099', 'climp000000000000000wh01',
  1436, 0, 1436, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000100', 'IMP-00100', NULL,
  'අඩි කෝදු', 'අඩි කෝදු', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 8, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000100', 'climpi00000000000100', 'climp000000000000000wh01',
  40, 0, 40, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000101', 'IMP-00101', NULL,
  'වෛරස් ගාඩ්', 'වෛරස් ගාඩ්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000101', 'climpi00000000000101', 'climp000000000000000wh01',
  0, 0, 0, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000102', 'IMP-00102', NULL,
  'MINI STEPLOR PIN  (NO10)', 'MINI STEPLOR PIN  (NO10)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 5, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000102', 'climpi00000000000102', 'climp000000000000000wh01',
  25, 0, 25, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000103', 'IMP-00103', NULL,
  'ලොකු STEPLOR PIN (23/10)', 'ලොකු STEPLOR PIN (23/10)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000103', 'climpi00000000000103', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000104', 'IMP-00104', NULL,
  'ලොකු කට්න්', 'ලොකු කට්න්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000104', 'climpi00000000000104', 'climp000000000000000wh01',
  4, 0, 4, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000105', 'IMP-00105', NULL,
  'පොඩි කට්න්', 'පොඩි කට්න්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 4, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000105', 'climpi00000000000105', 'climp000000000000000wh01',
  20, 0, 20, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000106', 'IMP-00106', NULL,
  'පැති මේස', 'පැති මේස', 'climpcat00000000000002',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000106', 'climpi00000000000106', 'climp000000000000000wh01',
  4, 0, 4, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000107', 'IMP-00107', NULL,
  'කොටු මේස', 'කොටු මේස', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 3, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000107', 'climpi00000000000107', 'climp000000000000000wh01',
  16, 0, 16, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000108', 'IMP-00108', NULL,
  'පාට්ෂන් කරන ලද මේස', 'පාට්ෂන් කරන ලද මේස', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 2, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000108', 'climpi00000000000108', 'climp000000000000000wh01',
  13, 0, 13, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000109', 'IMP-00109', NULL,
  'පරිගණක මේස', 'පරිගණක මේස', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000109', 'climpi00000000000109', 'climp000000000000000wh01',
  7, 0, 7, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000110', 'IMP-00110', NULL,
  'රැස්වීම් ශාලා මේස', 'රැස්වීම් ශාලා මේස', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000110', 'climpi00000000000110', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000111', 'IMP-00111', NULL,
  'ලී මේස', 'ලී මේස', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000111', 'climpi00000000000111', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000112', 'IMP-00112', NULL,
  'STUDY DESK', 'STUDY DESK', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000112', 'climpi00000000000112', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000113', 'IMP-00113', NULL,
  'විධායක පුටු  ලොකු', 'විධායක පුටු  ලොකු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000113', 'climpi00000000000113', 'climp000000000000000wh01',
  4, 0, 4, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000114', 'IMP-00114', NULL,
  'විධායක පුටු පොඩි', 'විධායක පුටු පොඩි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 4, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000114', 'climpi00000000000114', 'climp000000000000000wh01',
  23, 0, 23, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000115', 'IMP-00115', NULL,
  'පරිගණක පුටු', 'පරිගණක පුටු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 6, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000115', 'climpi00000000000115', 'climp000000000000000wh01',
  30, 0, 30, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000116', 'IMP-00116', NULL,
  'ඇඳි සහිත කලු කුෂන් පුටු යකඩ', 'ඇඳි සහිත කලු කුෂන් පුටු යකඩ', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000116', 'climpi00000000000116', 'climp000000000000000wh01',
  6, 0, 6, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000117', 'IMP-00117', NULL,
  'ඇඳි සහිත රතු කුෂන් පුටු යකඩ', 'ඇඳි සහිත රතු කුෂන් පුටු යකඩ', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000117', 'climpi00000000000117', 'climp000000000000000wh01',
  6, 0, 6, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000118', 'IMP-00118', NULL,
  'ඇඳිරහිත රතු කුෂන්', 'ඇඳිරහිත රතු කුෂන්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000118', 'climpi00000000000118', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000119', 'IMP-00119', NULL,
  'ලොබි පුටු', 'ලොබි පුටු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 2, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000119', 'climpi00000000000119', 'climp000000000000000wh01',
  10, 0, 10, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000120', 'IMP-00120', NULL,
  'ප්ලාස්ටික් පුටු', 'ප්ලාස්ටික් පුටු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 6, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000120', 'climpi00000000000120', 'climp000000000000000wh01',
  31, 0, 31, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000121', 'IMP-00121', NULL,
  'සෝෆා  කට්ටල', 'සෝෆා  කට්ටල', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000121', 'climpi00000000000121', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000122', 'IMP-00122', NULL,
  'ලී පුටු ඇඳි සහිත', 'ලී පුටු ඇඳි සහිත', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000122', 'climpi00000000000122', 'climp000000000000000wh01',
  4, 0, 4, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000123', 'IMP-00123', NULL,
  'ලි පුටු ඇඳි රහිත', 'ලි පුටු ඇඳි රහිත', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000123', 'climpi00000000000123', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000124', 'IMP-00124', NULL,
  'වානේ ලොකු කබඩ්', 'වානේ ලොකු කබඩ්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 2, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000124', 'climpi00000000000124', 'climp000000000000000wh01',
  14, 0, 14, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000125', 'IMP-00125', NULL,
  'වානේ පොඩි කබඩ්', 'වානේ පොඩි කබඩ්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000125', 'climpi00000000000125', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000126', 'IMP-00126', NULL,
  'වානේ කබඩ් විදුරු හඑිත', 'වානේ කබඩ් විදුරු හඑිත', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000126', 'climpi00000000000126', 'climp000000000000000wh01',
  5, 0, 5, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000127', 'IMP-00127', NULL,
  'මෙලමයින් /MDF  කබඩ්', 'මෙලමයින් /MDF  කබඩ්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000127', 'climpi00000000000127', 'climp000000000000000wh01',
  5, 0, 5, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000128', 'IMP-00128', NULL,
  'සිතියම් රඳවන ලාච්චු 8 ක් සහිත ලි කබඩ්', 'සිතියම් රඳවන ලාච්චු 8 ක් සහිත ලි කබඩ්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000128', 'climpi00000000000128', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000129', 'IMP-00129', NULL,
  'පැතිදොර 3කින් යුතු ලී පැති කබඩ්', 'පැතිදොර 3කින් යුතු ලී පැති කබඩ්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000129', 'climpi00000000000129', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000130', 'IMP-00130', NULL,
  'ප්ලෝටර් යන්ත්‍ර', 'ප්ලෝටර් යන්ත්‍ර', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000130', 'climpi00000000000130', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000131', 'IMP-00131', NULL,
  'ෆැක්ස් යන්ත්‍ර', 'ෆැක්ස් යන්ත්‍ර', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000131', 'climpi00000000000131', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000132', 'IMP-00132', NULL,
  'ප්‍රින්ගර් ප්‍රින්ට් යන්ත්‍ර', 'ප්‍රින්ගර් ප්‍රින්ට් යන්ත්‍ර', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000132', 'climpi00000000000132', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000133', 'IMP-00133', NULL,
  'දුරකතන', 'දුරකතන', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000133', 'climpi00000000000133', 'climp000000000000000wh01',
  8, 0, 8, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000134', 'IMP-00134', NULL,
  'සිංගර්  LED  රුපවාහිනි', 'සිංගර්  LED  රුපවාහිනි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000134', 'climpi00000000000134', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000135', 'IMP-00135', NULL,
  'ශබ්ද පටිගත කිරීමේ යන්ත්‍ර LENOVO  B 610', 'ශබ්ද පටිගත කිරීමේ යන්ත්‍ර LENOVO  B 610', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000135', 'climpi00000000000135', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000136', 'IMP-00136', NULL,
  'SMART BOARD 85/4K', 'SMART BOARD 85/4K', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000136', 'climpi00000000000136', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000137', 'IMP-00137', NULL,
  'CAMARA NICON', 'CAMARA NICON', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000137', 'climpi00000000000137', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000138', 'IMP-00138', NULL,
  'TV රඳවන', 'TV රඳවන', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000138', 'climpi00000000000138', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000139', 'IMP-00139', NULL,
  'ශිතකරණ - MINI BAR FRIDGE', 'ශිතකරණ - MINI BAR FRIDGE', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000139', 'climpi00000000000139', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000140', 'IMP-00140', NULL,
  'මුදල් සේප්පු', 'මුදල් සේප්පු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000140', 'climpi00000000000140', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000141', 'IMP-00141', NULL,
  'සේප්පු රඳවන', 'සේප්පු රඳවන', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000141', 'climpi00000000000141', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000142', 'IMP-00142', NULL,
  'මල්ටි මීඩියා ප්‍රොජෙක්ටර්', 'මල්ටි මීඩියා ප්‍රොජෙක්ටර්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000142', 'climpi00000000000142', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000143', 'IMP-00143', NULL,
  'රවුටර්', 'රවුටර්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000143', 'climpi00000000000143', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000144', 'IMP-00144', NULL,
  'මුදල් පේට්ටි -CASH BOX', 'මුදල් පේට්ටි -CASH BOX', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000144', 'climpi00000000000144', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000145', 'IMP-00145', NULL,
  'ORENGE DOT WIRLESS PRESENTER', 'ORENGE DOT WIRLESS PRESENTER', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000145', 'climpi00000000000145', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000146', 'IMP-00146', NULL,
  'JBL BOX 320', 'JBL BOX 320', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000146', 'climpi00000000000146', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000147', 'IMP-00147', NULL,
  'JBL WIRLESS MIC', 'JBL WIRLESS MIC', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000147', 'climpi00000000000147', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000148', 'IMP-00148', NULL,
  'TOSHIBA  (CHH16086)', 'TOSHIBA  (CHH16086)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000148', 'climpi00000000000148', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000149', 'IMP-00149', NULL,
  'ECSYS M 4125 - KYOCERA', 'ECSYS M 4125 - KYOCERA', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000149', 'climpi00000000000149', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000150', 'IMP-00150', NULL,
  'PRINTER -EPSON (M100)', 'PRINTER -EPSON (M100)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000150', 'climpi00000000000150', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000151', 'IMP-00151', NULL,
  'COLOR PRINTER (EPSON  L 130)', 'COLOR PRINTER (EPSON  L 130)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000151', 'climpi00000000000151', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000152', 'IMP-00152', NULL,
  'PRINTER BROTHER', 'PRINTER BROTHER', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000152', 'climpi00000000000152', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000153', 'IMP-00153', NULL,
  'PRINTER( LQ 310)- EPSON', 'PRINTER( LQ 310)- EPSON', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000153', 'climpi00000000000153', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000154', 'IMP-00154', NULL,
  'PRINTER BROTHER -2450XL', 'PRINTER BROTHER -2450XL', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000154', 'climpi00000000000154', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000155', 'IMP-00155', NULL,
  'MONITOR', 'MONITOR', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 5, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000155', 'climpi00000000000155', 'climp000000000000000wh01',
  27, 0, 27, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000156', 'IMP-00156', NULL,
  'CPU', 'CPU', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 3, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000156', 'climpi00000000000156', 'climp000000000000000wh01',
  15, 0, 15, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000157', 'IMP-00157', NULL,
  'UPS', 'UPS', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 6, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000157', 'climpi00000000000157', 'climp000000000000000wh01',
  30, 0, 30, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000158', 'IMP-00158', NULL,
  'MOUSE', 'MOUSE', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 4, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000158', 'climpi00000000000158', 'climp000000000000000wh01',
  23, 0, 23, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000159', 'IMP-00159', NULL,
  'KEYBOARD', 'KEYBOARD', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 5, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000159', 'climpi00000000000159', 'climp000000000000000wh01',
  27, 0, 27, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000160', 'IMP-00160', NULL,
  'SPEAKER', 'SPEAKER', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000160', 'climpi00000000000160', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000161', 'IMP-00161', NULL,
  'LAPTOP', 'LAPTOP', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 3, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000161', 'climpi00000000000161', 'climp000000000000000wh01',
  15, 0, 15, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000162', 'IMP-00162', NULL,
  'TAB', 'TAB', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000162', 'climpi00000000000162', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000163', 'IMP-00163', NULL,
  'CPU BOX (POTABAL)', 'CPU BOX (POTABAL)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000163', 'climpi00000000000163', 'climp000000000000000wh01',
  6, 0, 6, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000164', 'IMP-00164', NULL,
  'SCAN යන්ත්‍ර', 'SCAN යන්ත්‍ර', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000164', 'climpi00000000000164', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000165', 'IMP-00165', NULL,
  'WALL FAN', 'WALL FAN', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000165', 'climpi00000000000165', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000166', 'IMP-00166', NULL,
  'වායු සමීකරණ යන්ත්‍ර ලොකු -FORSTARE', 'වායු සමීකරණ යන්ත්‍ර ලොකු -FORSTARE', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000166', 'climpi00000000000166', 'climp000000000000000wh01',
  4, 0, 4, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000167', 'IMP-00167', NULL,
  'වායු සමීකරණ යන්ත්‍ර පොඩි LG', 'වායු සමීකරණ යන්ත්‍ර පොඩි LG', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000167', 'climpi00000000000167', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000168', 'IMP-00168', NULL,
  'WATER FILTER - SINGER', 'WATER FILTER - SINGER', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000168', 'climpi00000000000168', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000169', 'IMP-00169', NULL,
  'විදුලි පංකා', 'විදුලි පංකා', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000169', 'climpi00000000000169', 'climp000000000000000wh01',
  6, 0, 6, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000170', 'IMP-00170', NULL,
  'ටෙන්ඩර් පෙට්ටි', 'ටෙන්ඩර් පෙට්ටි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000170', 'climpi00000000000170', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000171', 'IMP-00171', NULL,
  'ඡායා පිටපත් යන්ත්‍ර රඳවන කඩා ලී මේස', 'ඡායා පිටපත් යන්ත්‍ර රඳවන කඩා ලී මේස', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000171', 'climpi00000000000171', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000172', 'IMP-00172', NULL,
  'වයිට් බෝඩ්', 'වයිට් බෝඩ්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000172', 'climpi00000000000172', 'climp000000000000000wh01',
  5, 0, 5, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000173', 'IMP-00173', NULL,
  'වයිට් බෝඩ් ස්ටෑන්ඩ්', 'වයිට් බෝඩ් ස්ටෑන්ඩ්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000173', 'climpi00000000000173', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000174', 'IMP-00174', NULL,
  'ලාච්චු 4 කබඩ් සඳහා ලිපි ගොනු රඳවන', 'ලාච්චු 4 කබඩ් සඳහා ලිපි ගොනු රඳවන', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 5, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000174', 'climpi00000000000174', 'climp000000000000000wh01',
  27, 0, 27, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000175', 'IMP-00175', NULL,
  'ඩ්‍රෝවිං බෝඩ්', 'ඩ්‍රෝවිං බෝඩ්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000175', 'climpi00000000000175', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000176', 'IMP-00176', NULL,
  'GPS උපකරණ', 'GPS උපකරණ', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000176', 'climpi00000000000176', 'climp000000000000000wh01',
  5, 0, 5, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000177', 'IMP-00177', NULL,
  '1TB EXTERNAL HARD DISK', '1TB EXTERNAL HARD DISK', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000177', 'climpi00000000000177', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000178', 'IMP-00178', NULL,
  '2TB EXTERNAL HARD DISK', '2TB EXTERNAL HARD DISK', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000178', 'climpi00000000000178', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000179', 'IMP-00179', NULL,
  'පැන්සල් කටර්', 'පැන්සල් කටර්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000179', 'climpi00000000000179', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000180', 'IMP-00180', NULL,
  'කාර්යාලිය බෙල්', 'කාර්යාලිය බෙල්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000180', 'climpi00000000000180', 'climp000000000000000wh01',
  5, 0, 5, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000181', 'IMP-00181', NULL,
  'ඇලුමීණියම් ඉණිමග', 'ඇලුමීණියම් ඉණිමග', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000181', 'climpi00000000000181', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000182', 'IMP-00182', NULL,
  'හෝස් බට', 'හෝස් බට', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000182', 'climpi00000000000182', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000183', 'IMP-00183', NULL,
  'ලිපිකරු මේස සඳහා DROWER DIVIDER', 'ලිපිකරු මේස සඳහා DROWER DIVIDER', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 4, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000183', 'climpi00000000000183', 'climp000000000000000wh01',
  22, 0, 22, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000184', 'IMP-00184', NULL,
  'ලීයෙන් සදන ලද බුදු කුටි', 'ලීයෙන් සදන ලද බුදු කුටි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000184', 'climpi00000000000184', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000185', 'IMP-00185', NULL,
  'බුදු පිළිම', 'බුදු පිළිම', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000185', 'climpi00000000000185', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000186', 'IMP-00186', NULL,
  'ජාතික කොඩි', 'ජාතික කොඩි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000186', 'climpi00000000000186', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000187', 'IMP-00187', NULL,
  'බෞද්ධ කොඩි', 'බෞද්ධ කොඩි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000187', 'climpi00000000000187', 'climp000000000000000wh01',
  4, 0, 4, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000188', 'IMP-00188', NULL,
  'දකුණු  පළාත් කොඩි', 'දකුණු  පළාත් කොඩි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000188', 'climpi00000000000188', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000189', 'IMP-00189', NULL,
  'දකුණු පළාත් පුෂ්ප', 'දකුණු පළාත් පුෂ්ප', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000189', 'climpi00000000000189', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000190', 'IMP-00190', NULL,
  'මැගලන් ලෙදර් කේස්', 'මැගලන් ලෙදර් කේස්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000190', 'climpi00000000000190', 'climp000000000000000wh01',
  4, 0, 4, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000191', 'IMP-00191', NULL,
  'පැමිණිලි සහ යෝජනා පෙට්ටි', 'පැමිණිලි සහ යෝජනා පෙට්ටි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000191', 'climpi00000000000191', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000193', 'IMP-00193', NULL,
  'කොම්පස් කෑලි 10 පෙට්ටි', 'කොම්පස් කෑලි 10 පෙට්ටි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000193', 'climpi00000000000193', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000194', 'IMP-00194', NULL,
  'හෑන්ඩ් රිස්ක් ග්ලාස්', 'හෑන්ඩ් රිස්ක් ග්ලාස්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000194', 'climpi00000000000194', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000195', 'IMP-00195', NULL,
  'ටෙක්නිකල් එල්ෆ ස්ෆෙසිප්කේෂන්', 'ටෙක්නිකල් එල්ෆ ස්ෆෙසිප්කේෂන්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000195', 'climpi00000000000195', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000196', 'IMP-00196', NULL,
  'සදර්න් ෆොවින්සිය් ප්ලැග් සෙට්', 'සදර්න් ෆොවින්සිය් ප්ලැග් සෙට්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000196', 'climpi00000000000196', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000197', 'IMP-00197', NULL,
  'ජලයේ ගුණාත්මක භාවය මනින උපකරණ ( bente-ph-meeter)', 'ජලයේ ගුණාත්මක භාවය මනින උපකරණ ( bente-ph-meeter)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000197', 'climpi00000000000197', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000198', 'IMP-00198', NULL,
  'බුදු කුටිය සඳහා ආරක්ෂිත', 'බුදු කුටිය සඳහා ආරක්ෂිත', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000198', 'climpi00000000000198', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000199', 'IMP-00199', NULL,
  'ලිපිගොනු බන්දේසි', 'ලිපිගොනු බන්දේසි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 3, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000199', 'climpi00000000000199', 'climp000000000000000wh01',
  15, 0, 15, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000200', 'IMP-00200', NULL,
  'යතුරු පුවරු', 'යතුරු පුවරු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000200', 'climpi00000000000200', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000201', 'IMP-00201', NULL,
  'මිනුම් ප්‍රිෂ්ම රඳවන', 'මිනුම් ප්‍රිෂ්ම රඳවන', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000201', 'climpi00000000000201', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000202', 'IMP-00202', NULL,
  'දැන්වීම්  පුවරු', 'දැන්වීම්  පුවරු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000202', 'climpi00000000000202', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000203', 'IMP-00203', NULL,
  'දෙපාර්තමේන්තු නාම පුවරු', 'දෙපාර්තමේන්තු නාම පුවරු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000203', 'climpi00000000000203', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000204', 'IMP-00204', NULL,
  'ඇත/නැත නාම පුවරු', 'ඇත/නැත නාම පුවරු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000204', 'climpi00000000000204', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000205', 'IMP-00205', NULL,
  'රාක්ක', 'රාක්ක', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000205', 'climpi00000000000205', 'climp000000000000000wh01',
  5, 0, 5, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000206', 'IMP-00206', NULL,
  'ලිපිගොනු රාක්ක', 'ලිපිගොනු රාක්ක', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000206', 'climpi00000000000206', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000207', 'IMP-00207', NULL,
  'ලිපි රඳවන', 'ලිපි රඳවන', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000207', 'climpi00000000000207', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000208', 'IMP-00208', NULL,
  'ඩිජිටල් මල්ටි මිටර්', 'ඩිජිටල් මල්ටි මිටර්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000208', 'climpi00000000000208', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000209', 'IMP-00209', NULL,
  'මල්ටීමිටර්', 'මල්ටීමිටර්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000209', 'climpi00000000000209', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000210', 'IMP-00210', NULL,
  'මල්  ඉස්කුරුපු නියන්', 'මල්  ඉස්කුරුපු නියන්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000210', 'climpi00000000000210', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000211', 'IMP-00211', NULL,
  'පැතලි ඉස්කුරුප්පු නියන්', 'පැතලි ඉස්කුරුප්පු නියන්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000211', 'climpi00000000000211', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000212', 'IMP-00212', NULL,
  'උල් අඬු', 'උල් අඬු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000212', 'climpi00000000000212', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000213', 'IMP-00213', NULL,
  'අඬු (ලොකු)', 'අඬු (ලොකු)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000213', 'climpi00000000000213', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000214', 'IMP-00214', NULL,
  'අඬු (පොඩි )', 'අඬු (පොඩි )', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000214', 'climpi00000000000214', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000215', 'IMP-00215', NULL,
  'ඇලිස් කටු', 'ඇලිස් කටු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000215', 'climpi00000000000215', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000216', 'IMP-00216', NULL,
  'හීට් ගන්', 'හීට් ගන්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000216', 'climpi00000000000216', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000217', 'IMP-00217', NULL,
  'hand blower  (bouth)', 'hand blower  (bouth)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000217', 'climpi00000000000217', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000218', 'IMP-00218', NULL,
  'solderng iron (bouth)', 'solderng iron (bouth)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000218', 'climpi00000000000218', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000219', 'IMP-00219', NULL,
  'crimpling tool (network  cable cutter)', 'crimpling tool (network  cable cutter)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000219', 'climpi00000000000219', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000220', 'IMP-00220', NULL,
  'jekemy tool set', 'jekemy tool set', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000220', 'climpi00000000000220', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000221', 'IMP-00221', NULL,
  'ඩිජිටල් මල්ටි මිටර්', 'ඩිජිටල් මල්ටි මිටර්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000221', 'climpi00000000000221', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000222', 'IMP-00222', NULL,
  'ඉස්කුරුප්පු නියන් සෙට් (screw drivwer swet)', 'ඉස්කුරුප්පු නියන් සෙට් (screw drivwer swet)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000222', 'climpi00000000000222', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000223', 'IMP-00223', NULL,
  'ෆවර් ටෙස්ටර්', 'ෆවර් ටෙස්ටර්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000223', 'climpi00000000000223', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000224', 'IMP-00224', NULL,
  'VGA කන්වටර්', 'VGA කන්වටර්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000224', 'climpi00000000000224', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000225', 'IMP-00225', NULL,
  'Auto multi meeter (AN 5 NG)', 'Auto multi meeter (AN 5 NG)', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000225', 'climpi00000000000225', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000226', 'IMP-00226', NULL,
  'ලොකු ස්ටේප්ලර්', 'ලොකු ස්ටේප්ලර්', 'climpcat00000000000001',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000226', 'climpi00000000000226', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000227', 'IMP-00227', NULL,
  'Glue gun', 'Glue gun', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000227', 'climpi00000000000227', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000228', 'IMP-00228', NULL,
  'Electric Kettle', 'Electric Kettle', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000228', 'climpi00000000000228', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000229', 'IMP-00229', NULL,
  'Electric jug', 'Electric jug', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000229', 'climpi00000000000229', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000230', 'IMP-00230', NULL,
  'සංග්‍රහා ලේකණය - පිරිසි කොප්ප -', 'සංග්‍රහා ලේකණය - පිරිසි කොප්ප -', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 140, 14, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000230', 'climpi00000000000230', 'climp000000000000000wh01',
  70, 0, 70, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000231', 'IMP-00231', NULL,
  'පිරිසි', 'පිරිසි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 140, 14, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000231', 'climpi00000000000231', 'climp000000000000000wh01',
  70, 0, 70, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000232', 'IMP-00232', NULL,
  'පිඟන්', 'පිඟන්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 3, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000232', 'climpi00000000000232', 'climp000000000000000wh01',
  19, 0, 19, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000233', 'IMP-00233', NULL,
  'දීසි', 'දීසි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 4, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000233', 'climpi00000000000233', 'climp000000000000000wh01',
  24, 0, 24, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000234', 'IMP-00234', NULL,
  'සයිඩ් ප්ලේට්', 'සයිඩ් ප්ලේට්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000234', 'climpi00000000000234', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000235', 'IMP-00235', NULL,
  'බත් දීසි', 'බත් දීසි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000235', 'climpi00000000000235', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000236', 'IMP-00236', NULL,
  'අත හෝදන  බෝල්', 'අත හෝදන  බෝල්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000236', 'climpi00000000000236', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000237', 'IMP-00237', NULL,
  'වීදුරු ජොග්ගු', 'වීදුරු ජොග්ගු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000237', 'climpi00000000000237', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000238', 'IMP-00238', NULL,
  'වතුර විදුරු', 'වතුර විදුරු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 4, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000238', 'climpi00000000000238', 'climp000000000000000wh01',
  23, 0, 23, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000239', 'IMP-00239', NULL,
  'ට්‍රේ ප්ලාස්ටික්', 'ට්‍රේ ප්ලාස්ටික්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000239', 'climpi00000000000239', 'climp000000000000000wh01',
  4, 0, 4, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000240', 'IMP-00240', NULL,
  'ට්‍රේ  ඇලුමීණියම්', 'ට්‍රේ  ඇලුමීණියම්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000240', 'climpi00000000000240', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000241', 'IMP-00241', NULL,
  'ජොග්ගු -ප්ලාස්ටික්', 'ජොග්ගු -ප්ලාස්ටික්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000241', 'climpi00000000000241', 'climp000000000000000wh01',
  4, 0, 4, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000242', 'IMP-00242', NULL,
  'ජෝග්ගු ඇලුමීණීයම්  - ලොකු', 'ජෝග්ගු ඇලුමීණීයම්  - ලොකු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000242', 'climpi00000000000242', 'climp000000000000000wh01',
  7, 0, 7, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000243', 'IMP-00243', NULL,
  'තේ හැඳි පොඩි', 'තේ හැඳි පොඩි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 3, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000243', 'climpi00000000000243', 'climp000000000000000wh01',
  19, 0, 19, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000244', 'IMP-00244', NULL,
  'තේ හැඳි - ලොකු', 'තේ හැඳි - ලොකු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000244', 'climpi00000000000244', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000245', 'IMP-00245', NULL,
  'බත් හැඳි', 'බත් හැඳි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000245', 'climpi00000000000245', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000246', 'IMP-00246', NULL,
  'මේස හැඳි සාමාන්‍ය ඇලුමීණීයම්', 'මේස හැඳි සාමාන්‍ය ඇලුමීණීයම්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000246', 'climpi00000000000246', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000247', 'IMP-00247', NULL,
  'මේස හැඳි ලෙකු  ඇලුමීණීයම්', 'මේස හැඳි ලෙකු  ඇලුමීණීයම්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000247', 'climpi00000000000247', 'climp000000000000000wh01',
  8, 0, 8, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000248', 'IMP-00248', NULL,
  'මේස හැඳි - ප්ලාස්ටික්', 'මේස හැඳි - ප්ලාස්ටික්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000248', 'climpi00000000000248', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000249', 'IMP-00249', NULL,
  'තේ පෙරණය  ප්ලාස්ටික්', 'තේ පෙරණය  ප්ලාස්ටික්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000249', 'climpi00000000000249', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000250', 'IMP-00250', NULL,
  'තේ පෙරණ ඇලුමිණියම', 'තේ පෙරණ ඇලුමිණියම', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000250', 'climpi00000000000250', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000251', 'IMP-00251', NULL,
  'පෝසිලේන් වංගෙඩි', 'පෝසිලේන් වංගෙඩි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000251', 'climpi00000000000251', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000252', 'IMP-00252', NULL,
  'පිහි', 'පිහි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000252', 'climpi00000000000252', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000253', 'IMP-00253', NULL,
  'පොඩි ප්ලාස්ටික් බේසම්', 'පොඩි ප්ලාස්ටික් බේසම්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000253', 'climpi00000000000253', 'climp000000000000000wh01',
  3, 0, 3, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000254', 'IMP-00254', NULL,
  'ලොකු ප්ලාස්ටික් බේසම්', 'ලොකු ප්ලාස්ටික් බේසම්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000254', 'climpi00000000000254', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000255', 'IMP-00255', NULL,
  'ලොකු බාස්කට්', 'ලොකු බාස්කට්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000255', 'climpi00000000000255', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000256', 'IMP-00256', NULL,
  'පොඩි බාස්කට්', 'පොඩි බාස්කට්', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000256', 'climpi00000000000256', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000257', 'IMP-00257', NULL,
  'සැලඩ් කප් වීදුරු', 'සැලඩ් කප් වීදුරු', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000257', 'climpi00000000000257', 'climp000000000000000wh01',
  4, 0, 4, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000258', 'IMP-00258', NULL,
  'මේස රෙදි', 'මේස රෙදි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000258', 'climpi00000000000258', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000259', 'IMP-00259', NULL,
  'සුදු රෙදි කැබලි (යාර )', 'සුදු රෙදි කැබලි (යාර )', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000259', 'climpi00000000000259', 'climp000000000000000wh01',
  2, 0, 2, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

INSERT INTO "Item" (
  "id", "itemCode", "barcode", "nameEn", "nameSi", "categoryId", "unit", "unitSi",
  "minStock", "maxStock", "reorderLevel", "unitPrice", "warehouseId", "dimensions",
  "isActive", "createdAt", "updatedAt"
) VALUES (
  'climpi00000000000260', 'IMP-00260', NULL,
  'තුවා - පොඩි', 'තුවා - පොඩි', 'climpcat00000000000003',
  'pcs', 'ඒකක', 0, 100, 1, 0,
  'climp000000000000000wh01', NULL, true, NOW(), NOW()
) ON CONFLICT ("itemCode") DO UPDATE SET
  "nameEn" = EXCLUDED."nameEn",
  "nameSi" = EXCLUDED."nameSi",
  "categoryId" = EXCLUDED."categoryId",
  "barcode" = EXCLUDED."barcode",
  "dimensions" = EXCLUDED."dimensions",
  "maxStock" = EXCLUDED."maxStock",
  "reorderLevel" = EXCLUDED."reorderLevel",
  "isActive" = true,
  "deletedAt" = NULL,
  "updatedAt" = NOW();

INSERT INTO "Inventory" (
  "id", "itemId", "warehouseId", "currentStock", "reservedStock", "availableStock", "updatedAt"
) VALUES (
  'climv00000000000260', 'climpi00000000000260', 'climp000000000000000wh01',
  1, 0, 1, NOW()
) ON CONFLICT ("itemId", "warehouseId") DO UPDATE SET
  "currentStock" = EXCLUDED."currentStock",
  "availableStock" = EXCLUDED."availableStock",
  "updatedAt" = NOW();

COMMIT;
