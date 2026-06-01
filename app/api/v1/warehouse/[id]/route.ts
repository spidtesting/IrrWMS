import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, NotFoundError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import { getRequestAuditContext, writeModuleAudit } from "@/lib/api/helpers";
import { updateWarehouseSchema } from "@/lib/validations/warehouse";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireRouteAccess("warehouses");
    const { id } = await params;

    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: {
        zones: { include: { binLocations: true } },
        _count: {
          select: {
            items: true,
            inventories: true,
            users: true,
          },
        },
      },
    });

    if (!warehouse) throw new NotFoundError("Warehouse not found");

    return successResponse(warehouse);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("ADMIN");
    await requireRouteAccess("warehouses");
    const { id } = await params;
    const body = updateWarehouseSchema.parse({ id, ...(await request.json()) });
    const audit = getRequestAuditContext(request);

    const { id: _id, ...data } = body;

    const updated = await prisma.warehouse.update({
      where: { id },
      data,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "UPDATE",
      module: "Warehouse",
      details: { entityId: id, changes: data },
      ...audit,
    });

    return successResponse(updated, { message: "Warehouse updated" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("SUPER_ADMIN");
    await requireRouteAccess("warehouses");
    const { id } = await params;
    const audit = getRequestAuditContext(_request);

    const existing = await prisma.warehouse.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Warehouse not found");

    const updated = await prisma.warehouse.update({
      where: { id },
      data: { isActive: false },
    });

    await writeModuleAudit({
      userId: user.id,
      action: "DELETE",
      module: "Warehouse",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "Warehouse deactivated" });
  } catch (error) {
    return handleApiError(error);
  }
}
