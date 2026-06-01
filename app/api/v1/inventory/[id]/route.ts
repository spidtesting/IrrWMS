import { NextRequest } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, NotFoundError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import {
  getRequestAuditContext,
  writeModuleAudit,
  resolveWarehouseFilter,
  inventoryInclude,
} from "@/lib/api/helpers";
import { decimalSchema, optionalCuidSchema } from "@/lib/validations/common";

type RouteParams = { params: Promise<{ id: string }> };

const updateInventorySchema = z.object({
  nameEn: z.string().min(2).max(255).optional(),
  nameSi: z.string().min(2).max(255).optional(),
  minStock: z.number().min(0).optional(),
  maxStock: z.number().min(0).optional(),
  reorderLevel: z.number().min(0).optional(),
  unitPrice: decimalSchema.optional(),
  supplierId: optionalCuidSchema,
  binLocationId: optionalCuidSchema,
  imageUrl: z.string().url().optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRouteAccess("inventory");
    const { id } = await params;

    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: inventoryInclude,
    });

    if (!inventory || inventory.item.deletedAt) {
      throw new NotFoundError("Inventory record not found");
    }

    resolveWarehouseFilter(user, inventory.warehouseId);

    return successResponse(inventory);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("inventory");
    const { id } = await params;
    const body = updateInventorySchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    const existing = await prisma.inventory.findUnique({
      where: { id },
      include: { item: true },
    });

    if (!existing || existing.item.deletedAt) {
      throw new NotFoundError("Inventory record not found");
    }

    resolveWarehouseFilter(user, existing.warehouseId);

    const updated = await prisma.$transaction(async (tx) => {
      await tx.item.update({
        where: { id: existing.itemId },
        data: {
          ...(body.nameEn !== undefined ? { nameEn: body.nameEn } : {}),
          ...(body.nameSi !== undefined ? { nameSi: body.nameSi } : {}),
          ...(body.minStock !== undefined ? { minStock: body.minStock } : {}),
          ...(body.maxStock !== undefined ? { maxStock: body.maxStock } : {}),
          ...(body.reorderLevel !== undefined ? { reorderLevel: body.reorderLevel } : {}),
          ...(body.unitPrice !== undefined ? { unitPrice: new Decimal(body.unitPrice) } : {}),
          ...(body.supplierId !== undefined ? { supplierId: body.supplierId } : {}),
          ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),
          ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
        },
      });

      return tx.inventory.update({
        where: { id },
        data: {
          ...(body.binLocationId !== undefined ? { binLocationId: body.binLocationId } : {}),
        },
        include: inventoryInclude,
      });
    });

    await writeModuleAudit({
      userId: user.id,
      action: "UPDATE",
      module: "Inventory",
      details: { entityId: id, changes: body },
      ...audit,
    });

    return successResponse(updated, { message: "Inventory updated" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("MANAGER");
    await requireRouteAccess("inventory");
    const { id } = await params;
    const audit = getRequestAuditContext(_request);

    const existing = await prisma.inventory.findUnique({
      where: { id },
      include: { item: true },
    });

    if (!existing || existing.item.deletedAt) {
      throw new NotFoundError("Inventory record not found");
    }

    resolveWarehouseFilter(user, existing.warehouseId);

    await prisma.item.update({
      where: { id: existing.itemId },
      data: {
        isActive: false,
        deletedAt: new Date(),
        deletedById: user.id,
      },
    });

    await writeModuleAudit({
      userId: user.id,
      action: "DELETE",
      module: "Inventory",
      details: { entityId: id, itemId: existing.itemId },
      ...audit,
    });

    return successResponse({ id }, { message: "Inventory item soft deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
