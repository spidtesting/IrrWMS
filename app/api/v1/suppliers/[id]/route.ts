import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, NotFoundError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import { getRequestAuditContext, writeModuleAudit } from "@/lib/api/helpers";
import { updateSupplierSchema } from "@/lib/validations/supplier";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireRouteAccess("orders");
    const { id } = await params;

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        _count: { select: { items: true, purchaseOrders: true } },
      },
    });

    if (!supplier) throw new NotFoundError("Supplier not found");

    return successResponse(supplier);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("MANAGER");
    await requireRouteAccess("orders");
    const { id } = await params;
    const body = updateSupplierSchema.parse({ id, ...(await request.json()) });
    const audit = getRequestAuditContext(request);

    const { id: _id, ...data } = body;

    const updated = await prisma.supplier.update({
      where: { id },
      data,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "UPDATE",
      module: "Supplier",
      details: { entityId: id, changes: data },
      ...audit,
    });

    return successResponse(updated, { message: "Supplier updated" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("ADMIN");
    await requireRouteAccess("orders");
    const { id } = await params;
    const audit = getRequestAuditContext(_request);

    const existing = await prisma.supplier.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Supplier not found");

    const updated = await prisma.supplier.update({
      where: { id },
      data: { isActive: false },
    });

    await writeModuleAudit({
      userId: user.id,
      action: "DELETE",
      module: "Supplier",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "Supplier deactivated" });
  } catch (error) {
    return handleApiError(error);
  }
}
