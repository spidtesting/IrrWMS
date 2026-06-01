import * as XLSX from "xlsx";
import { formatDate, formatCurrency, formatQuantity } from "@/lib/utils/formatters";

export type ExportColumn<T> = {
  key: keyof T | string;
  header: string;
  formatter?: (value: unknown, row: T) => string | number;
};

export type ExportOptions = {
  sheetName?: string;
  fileName?: string;
  locale?: "en" | "si";
};

export function exportToCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: ExportColumn<T>[],
): string {
  const headers = columns.map((c) => c.header);
  const lines = rows.map((row) =>
    columns
      .map((col) => {
        const raw =
          typeof col.key === "string" && col.key in row ? row[col.key as keyof T] : undefined;
        const value = col.formatter ? col.formatter(raw, row) : raw;
        return escapeCsvCell(String(value ?? ""));
      })
      .join(","),
  );

  return [headers.join(","), ...lines].join("\n");
}

export function exportToExcelBuffer<T extends Record<string, unknown>>(
  rows: T[],
  columns: ExportColumn<T>[],
  options?: ExportOptions,
): Buffer {
  const sheetData = [
    columns.map((c) => c.header),
    ...rows.map((row) =>
      columns.map((col) => {
        const raw =
          typeof col.key === "string" && col.key in row ? row[col.key as keyof T] : undefined;
        const value = col.formatter ? col.formatter(raw, row) : raw;
        return value ?? "";
      }),
    ),
  ];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, options?.sheetName ?? "Sheet1");

  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}

export function downloadBlob(content: BlobPart, fileName: string, mime: string): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export const inventoryExportColumns: ExportColumn<{
  itemCode: string;
  nameEn: string;
  nameSi: string;
  category: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  unit: string;
  unitPrice: number;
  warehouse: string;
}>[] = [
  { key: "itemCode", header: "Item Code" },
  { key: "nameEn", header: "Name (EN)" },
  { key: "nameSi", header: "Name (SI)" },
  { key: "category", header: "Category" },
  {
    key: "currentStock",
    header: "Current Stock",
    formatter: (v, row) => formatQuantity(Number(v), row.unit),
  },
  { key: "reservedStock", header: "Reserved" },
  { key: "availableStock", header: "Available" },
  {
    key: "unitPrice",
    header: "Unit Price",
    formatter: (v) => formatCurrency(Number(v)),
  },
  { key: "warehouse", header: "Warehouse" },
];

export const stockEntryExportColumns: ExportColumn<{
  entryNumber: string;
  type: string;
  itemName: string;
  quantity: number;
  status: string;
  createdAt: Date | string;
  warehouse: string;
}>[] = [
  { key: "entryNumber", header: "Entry No" },
  { key: "type", header: "Type" },
  { key: "itemName", header: "Item" },
  { key: "quantity", header: "Quantity" },
  { key: "status", header: "Status" },
  {
    key: "createdAt",
    header: "Date",
    formatter: (v) => formatDate(v as Date | string),
  },
  { key: "warehouse", header: "Warehouse" },
];

function escapeCsvCell(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildExportFileName(prefix: string, extension: string): string {
  const timestamp = new Date().toISOString().slice(0, 10);
  return `${prefix}_${timestamp}.${extension}`;
}
