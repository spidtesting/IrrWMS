import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { paginatedResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess } from "@/lib/auth-guard";
import { parsePagination, buildPaginationMeta } from "@/lib/pagination";
import {
  resolveWarehouseFilter,
  inventoryInclude,
  objectFromSearchParams,
} from "@/lib/api/helpers";
import { cuidSchema } from "@/lib/validations/common";
import { z } from "zod";

const lowStockQuerySchema = z.object({
  warehouseId: cuidSchema.optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireRouteAccess("inventory");
    const { searchParams } = request.nextUrl;
    const query = lowStockQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams, { defaultLimit: query.limit ?? 50 });
    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);

    const inventories = await prisma.inventory.findMany({
      where: {
        ...(warehouseId ? { warehouseId } : {}),
        item: {
          isActive: true,
          deletedAt: null,
          reorderLevel: { gt: 0 },
        },
      },
      include: {
        ...inventoryInclude,
        item: {
          include: {
            category: true,
            supplier: true,
          },
        },
      },
    });

    const lowStock = inventories
      .filter((inv) => inv.currentStock <= inv.item.reorderLevel)
      .sort((a, b) => {
        const ratioA = a.currentStock / (a.item.reorderLevel || 1);
        const ratioB = b.currentStock / (b.item.reorderLevel || 1);
        return ratioA - ratioB;
      });

    const total = lowStock.length;
    const data = lowStock.slice(pagination.skip, pagination.skip + pagination.limit);

    return paginatedResponse(data, buildPaginationMeta(total, pagination), {
      message: `${total} item(s) below reorder level`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
