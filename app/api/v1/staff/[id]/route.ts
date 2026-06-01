import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, NotFoundError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import { hashPassword } from "@/lib/auth";
import {
  getRequestAuditContext,
  writeModuleAudit,
  resolveWarehouseFilter,
} from "@/lib/api/helpers";
import { updateUserSchema } from "@/lib/validations/user";

type RouteParams = { params: Promise<{ id: string }> };

const staffSelect = {
  id: true,
  employeeId: true,
  fullNameEn: true,
  fullNameSi: true,
  email: true,
  role: true,
  warehouseId: true,
  isActive: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
  warehouse: { select: { id: true, code: true, nameEn: true } },
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRouteAccess("users");
    const { id } = await params;

    const staff = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        ...staffSelect,
        _count: {
          select: {
            stockEntries: true,
            tasks: true,
            auditLogs: true,
          },
        },
      },
    });

    if (!staff) throw new NotFoundError("Staff member not found");

    if (staff.warehouseId) {
      resolveWarehouseFilter(user, staff.warehouseId);
    }

    return successResponse(staff);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("ADMIN");
    await requireRouteAccess("users");
    const { id } = await params;
    const body = updateUserSchema.parse({ id, ...(await request.json()) });
    const audit = getRequestAuditContext(request);

    const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundError("Staff member not found");

    if (existing.warehouseId) {
      resolveWarehouseFilter(user, existing.warehouseId);
    }

    const { id: _id, password, ...data } = body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        ...(password ? { password: await hashPassword(password) } : {}),
      },
      select: staffSelect,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "UPDATE",
      module: "User",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "Staff member updated" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("ADMIN");
    await requireRouteAccess("users");
    const { id } = await params;
    const audit = getRequestAuditContext(_request);

    const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundError("Staff member not found");

    const updated = await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
      select: staffSelect,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "DELETE",
      module: "User",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "Staff member deactivated" });
  } catch (error) {
    return handleApiError(error);
  }
}
