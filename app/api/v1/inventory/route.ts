import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { successResponse, paginatedResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import { parsePagination, buildPaginationMeta } from "@/lib/pagination";
import {
  getRequestAuditContext,
  writeModuleAudit,
  resolveWarehouseFilter,
  inventoryInclude,
  objectFromSearchParams,
} from "@/lib/api/helpers";
import { inventoryQuerySchema } from "@/lib/validations/inventory";
import { cuidSchema, decimalSchema, optionalCuidSchema } from "@/lib/validations/common";

const createInventorySchema = z.object({
  itemCode: z.string().min(2).max(30),
  barcode: z.string().max(50).optional().nullable(),
  nameEn: z.string().min(2).max(255),
  nameSi: z.string().min(2).max(255),
  categoryId: cuidSchema,
  unit: z.string().min(1).max(20),
  unitSi: z.string().min(1).max(20),
  minStock: z.number().min(0).default(0),
  maxStock: z.number().min(0).default(0),
  reorderLevel: z.number().min(0).default(0),
  unitPrice: decimalSchema,
  warehouseId: cuidSchema,
  supplierId: optionalCuidSchema,
  binLocationId: optionalCuidSchema,
  initialStock: z.number().min(0).default(0),
  imageUrl: z.string().url().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireRouteAccess("inventory");
    const { searchParams } = request.nextUrl;
    const query = inventoryQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);
    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);

    const baseWhere: Prisma.InventoryWhereInput = {
      ...(warehouseId ? { warehouseId } : {}),
      ...(query.categoryId ? { item: { categoryId: query.categoryId } } : {}),
      ...(query.binLocationId ? { binLocationId: query.binLocationId } : {}),
      item: {
        isActive: true,
        deletedAt: null,
        ...(query.search
          ? {
              OR: [
                { itemCode: { contains: query.search, mode: "insensitive" } },
                { nameEn: { contains: query.search, mode: "insensitive" } },
                { nameSi: { contains: query.search, mode: "insensitive" } },
                { barcode: { contains: query.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
    };

    const finalWhere: Prisma.InventoryWhereInput = { ...baseWhere };

    if (query.lowStockOnly) {
      const candidates = await prisma.inventory.findMany({
        where: {
          ...baseWhere,
          item: {
            ...(baseWhere.item as Prisma.ItemWhereInput),
            reorderLevel: { gt: 0 },
          },
        },
        include: { item: { select: { reorderLevel: true } } },
      });

      const lowStockIds = candidates
        .filter((inv) => inv.currentStock <= inv.item.reorderLevel)
        .map((inv) => inv.id);

      finalWhere.id = { in: lowStockIds.length > 0 ? lowStockIds : ["__none__"] };
    }

    const [total, data] = await Promise.all([
      prisma.inventory.count({ where: finalWhere }),
      prisma.inventory.findMany({
        where: finalWhere,
        include: inventoryInclude,
        orderBy: { updatedAt: "desc" },
        skip: pagination.skip,
        take: pagination.limit,
      }),
    ]);

    return paginatedResponse(data, buildPaginationMeta(total, pagination));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("inventory");
    const body = createInventorySchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    resolveWarehouseFilter(user, body.warehouseId);

    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.item.create({
        data: {
          itemCode: body.itemCode,
          barcode: body.barcode ?? undefined,
          nameEn: body.nameEn,
          nameSi: body.nameSi,
          categoryId: body.categoryId,
          unit: body.unit,
          unitSi: body.unitSi,
          minStock: body.minStock,
          maxStock: body.maxStock,
          reorderLevel: body.reorderLevel,
          unitPrice: new Decimal(body.unitPrice),
          warehouseId: body.warehouseId,
          supplierId: body.supplierId ?? undefined,
          imageUrl: body.imageUrl ?? undefined,
        },
      });

      const inventory = await tx.inventory.create({
        data: {
          itemId: item.id,
          warehouseId: body.warehouseId,
          currentStock: body.initialStock,
          reservedStock: 0,
          availableStock: body.initialStock,
          binLocationId: body.binLocationId ?? undefined,
        },
        include: inventoryInclude,
      });

      return inventory;
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "Inventory",
      details: { entityId: result.id, itemId: result.itemId, warehouseId: result.warehouseId },
      ...audit,
    });

    return successResponse(result, { status: 201, message: "Inventory item created" });
  } catch (error) {
    return handleApiError(error);
  }
}
