import * as XLSX from "xlsx";

export type ExcelItemRow = {
  itemId: number;
  itemName: string;
  category: string;
  serialNo: string;
  model: string;
  currentStock: number;
};

export type NormalizedCategory = {
  code: string;
  nameEn: string;
  nameSi: string;
};

export type ParsedItemRecord = {
  itemCode: string;
  nameEn: string;
  nameSi: string;
  categoryCode: string;
  barcode: string | null;
  model: string | null;
  currentStock: number;
  excelItemId: number;
};

const CATEGORY_MAP: Record<string, NormalizedCategory> = {
  stationary: {
    code: "CAT-STATIONERY",
    nameEn: "Stationery",
    nameSi: "ලිපිද්‍රව්‍ය",
  },
  inventory: {
    code: "CAT-INVENTORY",
    nameEn: "Inventory supplies",
    nameSi: "ඉන්වෙන්ටරි සැපයුම්",
  },
  general: {
    code: "CAT-GENERAL",
    nameEn: "General",
    nameSi: "සාමාන්‍ය",
  },
};

export function normalizeCategoryKey(raw: string): keyof typeof CATEGORY_MAP {
  const cleaned = raw
    .replace(/\u200B/g, "")
    .trim()
    .toLowerCase();

  if (!cleaned || cleaned === ",") return "general";
  if (cleaned.includes("station")) return "stationary";
  if (cleaned.includes("invet")) return "inventory";
  return "general";
}

export function normalizeCategory(raw: string): NormalizedCategory {
  return CATEGORY_MAP[normalizeCategoryKey(raw)];
}

function cleanText(value: unknown): string {
  return String(value ?? "")
    .replace(/\u200B/g, "")
    .trim();
}

function parseStock(value: unknown): number {
  if (value === "" || value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

export function parseItemsWorkbook(buffer: Buffer | ArrayBuffer): ParsedItemRecord[] {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheetName = wb.SheetNames.includes("Items") ? "Items" : wb.SheetNames[0];
  if (!sheetName) return [];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[sheetName]!, {
    defval: "",
  });

  const records: ParsedItemRecord[] = [];

  for (const row of rows) {
    const itemName = cleanText(row.ItemName);
    const itemId = Number(row.ItemID);
    if (!itemName || !Number.isFinite(itemId)) continue;

    const category = normalizeCategory(cleanText(row.Category));
    const serialNo = cleanText(row.SerialNo);
    const model = cleanText(row.Model);
    const currentStock = parseStock(row.CurrentStock);

    records.push({
      excelItemId: itemId,
      itemCode: `IMP-${String(itemId).padStart(5, "0")}`,
      nameEn: itemName,
      nameSi: itemName,
      categoryCode: category.code,
      barcode: serialNo && serialNo !== "-" ? serialNo : null,
      model: model && model !== "-" ? model : null,
      currentStock,
    });
  }

  return records;
}

export function getCategoriesFromRecords(records: ParsedItemRecord[]): NormalizedCategory[] {
  const codes = new Set(records.map((r) => r.categoryCode));
  return Array.from(codes)
    .map((code) => Object.values(CATEGORY_MAP).find((c) => c.code === code)!)
    .filter(Boolean);
}

export function sqlEscape(value: string): string {
  return value.replace(/'/g, "''");
}

/** Stable IDs for SQL import (re-runnable). */
export const IMPORT_WAREHOUSE_ID = "climp000000000000000wh01";
export const IMPORT_WAREHOUSE_CODE = "WH-IMP-01";

const CATEGORY_IDS: Record<string, string> = {
  "CAT-STATIONERY": "climpcat00000000000001",
  "CAT-INVENTORY": "climpcat00000000000002",
  "CAT-GENERAL": "climpcat00000000000003",
};

export function categorySqlId(code: string): string {
  return CATEGORY_IDS[code] ?? CATEGORY_IDS["CAT-GENERAL"]!;
}

export function itemSqlId(itemCode: string): string {
  const num = itemCode.replace(/^IMP-/, "");
  return `climpi${num.padStart(14, "0")}`;
}

export function inventorySqlId(itemCode: string): string {
  const num = itemCode.replace(/^IMP-/, "");
  return `climv${num.padStart(14, "0")}`;
}
