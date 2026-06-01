import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess } from "@/lib/auth-guard";
import { resolveWarehouseFilter } from "@/lib/api/helpers";
import {
  buildExportFileName,
  exportToCsv,
  exportToExcelBuffer,
  inventoryExportColumns,
  stockEntryExportColumns,
  type ExportColumn,
} from "@/lib/utils/export";
import { cuidSchema } from "@/lib/validations/common";

type RouteParams = { params: Promise<{ type: string }> };

const exportQuerySchema = z.object({
  format: z.enum(["csv", "xlsx"]).default("csv"),
  warehouseId: cuidSchema.optional(),
});

const SUPPORTED_TYPES = [
  "inventory",
  "stock-entry",
  "goods-received",
  "goods-issued",
  "suppliers",
] as const;

type ExportType = (typeof SUPPORTED_TYPES)[number];

function isExportType(value: string): value is ExportType {
  return (SUPPORTED_TYPES as readonly string[]).includes(value);
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRouteAccess("reports");
    const { type } = await params;

    if (!isExportType(type)) {
      return errorResponse("VALIDATION_ERROR", `Unsupported export type: ${type}`, {
        status: 422,
      });
    }

    const { searchParams } = request.nextUrl;
    const query = exportQuerySchema.parse({
      format: searchParams.get("format") ?? "csv",
      warehouseId: searchParams.get("warehouseId") ?? undefined,
    });

    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);

    let rows: Record<string, unknown>[] = [];
    let columns: ExportColumn<Record<string, unknown>>[] = inventoryExportColumns as ExportColumn<
      Record<string, unknown>
    >[];

    switch (type) {
      case "inventory": {
        const data = await prisma.inventory.findMany({
          where: {
            ...(warehouseId ? { warehouseId } : {}),
            item: { isActive: true, deletedAt: null },
          },
          include: {
            item: { include: { category: true } },
            warehouse: true,
          },
        });

        rows = data.map((inv) => ({
          itemCode: inv.item.itemCode,
          nameEn: inv.item.nameEn,
          nameSi: inv.item.nameSi,
          category: inv.item.category.nameEn,
          currentStock: inv.currentStock,
          reservedStock: inv.reservedStock,
          availableStock: inv.availableStock,
          unit: inv.item.unit,
          unitPrice: Number(inv.item.unitPrice),
          warehouse: inv.warehouse.nameEn,
        }));
        columns = inventoryExportColumns as ExportColumn<Record<string, unknown>>[];
        break;
      }

      case "stock-entry": {
        columns = stockEntryExportColumns as ExportColumn<Record<string, unknown>>[];
        const data = await prisma.stockEntry.findMany({
          where: warehouseId ? { warehouseId } : {},
          include: {
            item: { select: { nameEn: true } },
            warehouse: { select: { nameEn: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 5000,
        });

        rows = data.map((entry) => ({
          entryNumber: entry.entryNumber,
          type: entry.type,
          itemName: entry.item.nameEn,
          quantity: entry.quantity,
          status: entry.status,
          createdAt: entry.createdAt,
          warehouse: entry.warehouse.nameEn,
        }));
        break;
      }

      case "goods-received": {
        const data = await prisma.goodsReceiptNote.findMany({
          where: warehouseId ? { warehouseId } : {},
          include: { supplier: true, warehouse: true },
          orderBy: { createdAt: "desc" },
          take: 5000,
        });

        rows = data.map((grn) => ({
          grnNo: grn.grnNo,
          supplier: grn.supplier.nameEn,
          warehouse: grn.warehouse.nameEn,
          status: grn.status,
          receivedDate: grn.receivedDate ?? "",
          createdAt: grn.createdAt,
        }));

        columns = [
          { key: "grnNo", header: "GRN No" },
          { key: "supplier", header: "Supplier" },
          { key: "warehouse", header: "Warehouse" },
          { key: "status", header: "Status" },
          { key: "receivedDate", header: "Received Date" },
          { key: "createdAt", header: "Created At" },
        ];
        break;
      }

      case "goods-issued": {
        const data = await prisma.goodsIssueNote.findMany({
          where: warehouseId ? { warehouseId } : {},
          include: { warehouse: true, issuedTo: true },
          orderBy: { createdAt: "desc" },
          take: 5000,
        });

        rows = data.map((gin) => ({
          ginNo: gin.ginNo,
          issuedTo: gin.issuedTo.fullNameEn,
          warehouse: gin.warehouse.nameEn,
          status: gin.status,
          issueDate: gin.issueDate ?? "",
          createdAt: gin.createdAt,
        }));

        columns = [
          { key: "ginNo", header: "GIN No" },
          { key: "issuedTo", header: "Issued To" },
          { key: "warehouse", header: "Warehouse" },
          { key: "status", header: "Status" },
          { key: "issueDate", header: "Issue Date" },
          { key: "createdAt", header: "Created At" },
        ];
        break;
      }

      case "suppliers": {
        const data = await prisma.supplier.findMany({
          where: { isActive: true },
          orderBy: { nameEn: "asc" },
        });

        rows = data.map((supplier) => ({
          code: supplier.code,
          nameEn: supplier.nameEn,
          nameSi: supplier.nameSi,
          contact: supplier.contact,
          email: supplier.email ?? "",
          address: supplier.address,
        }));

        columns = [
          { key: "code", header: "Code" },
          { key: "nameEn", header: "Name (EN)" },
          { key: "nameSi", header: "Name (SI)" },
          { key: "contact", header: "Contact" },
          { key: "email", header: "Email" },
          { key: "address", header: "Address" },
        ];
        break;
      }
    }

    const fileName = buildExportFileName(type, query.format);

    if (query.format === "xlsx") {
      const buffer = exportToExcelBuffer(rows, columns, { sheetName: type });
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    }

    const csv = exportToCsv(rows, columns);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
