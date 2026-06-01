import { NextRequest } from "next/server";
import { DamageStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, ConflictError, NotFoundError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import {
  getRequestAuditContext,
  writeModuleAudit,
  resolveWarehouseFilter,
} from "@/lib/api/helpers";
import {
  approveDamageReportSchema,
  updateDamageReportSchema,
  updateDamageStatusSchema,
} from "@/lib/validations/damage-report";

type RouteParams = { params: Promise<{ id: string }> };

const damageInclude = {
  warehouse: true,
  reportedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  approvedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  lines: { include: { item: true } },
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRouteAccess("inventory");
    const { id } = await params;

    const report = await prisma.damageReport.findUnique({
      where: { id },
      include: damageInclude,
    });

    if (!report) throw new NotFoundError("Damage report not found");

    resolveWarehouseFilter(user, report.warehouseId);

    return successResponse(report);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("inventory");
    const { id } = await params;
    const audit = getRequestAuditContext(request);
    const raw = await request.json();

    const existing = await prisma.damageReport.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Damage report not found");

    resolveWarehouseFilter(user, existing.warehouseId);

    if (raw.action === "approve") {
      const approve = approveDamageReportSchema.parse({ id, ...raw });

      const updated = await prisma.damageReport.update({
        where: { id },
        data: {
          status: DamageStatus.APPROVED,
          approvedById: user.id,
          approvedAt: new Date(),
          remarks: approve.remarks ?? existing.remarks,
        },
        include: damageInclude,
      });

      await writeModuleAudit({
        userId: user.id,
        action: "APPROVE",
        module: "DamageReport",
        details: { entityId: id },
        ...audit,
      });

      return successResponse(updated, { message: "Damage report approved" });
    }

    if (raw.status !== undefined) {
      const statusUpdate = updateDamageStatusSchema.parse({ id, ...raw });

      const updated = await prisma.damageReport.update({
        where: { id },
        data: {
          status: statusUpdate.status,
          remarks: statusUpdate.remarks ?? existing.remarks,
        },
        include: damageInclude,
      });

      return successResponse(updated, { message: "Damage report status updated" });
    }

    const body = updateDamageReportSchema.parse({ id, ...raw });

    if (existing.status !== DamageStatus.DRAFT) {
      throw new ConflictError("Only draft damage reports can be edited");
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (body.lines) {
        await tx.damageReportLine.deleteMany({ where: { damageReportId: id } });
      }

      const totalCost = body.lines
        ? body.lines.reduce((sum, line) => sum + line.costImpact, 0)
        : Number(existing.totalCost);

      return tx.damageReport.update({
        where: { id },
        data: {
          ...(body.warehouseId ? { warehouseId: body.warehouseId } : {}),
          ...(body.incidentDate ? { incidentDate: body.incidentDate } : {}),
          ...(body.remarks !== undefined ? { remarks: body.remarks } : {}),
          ...(body.lines
            ? {
                totalCost: new Decimal(totalCost),
                lines: {
                  create: body.lines.map((line) => ({
                    itemId: line.itemId,
                    quantity: line.quantity,
                    reason: line.reason,
                    costImpact: new Decimal(line.costImpact),
                    images: line.images ?? undefined,
                  })),
                },
              }
            : {}),
        },
        include: damageInclude,
      });
    });

    await writeModuleAudit({
      userId: user.id,
      action: "UPDATE",
      module: "DamageReport",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "Damage report updated" });
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

    const existing = await prisma.damageReport.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Damage report not found");

    resolveWarehouseFilter(user, existing.warehouseId);

    if (existing.status === DamageStatus.APPROVED) {
      throw new ConflictError("Approved damage reports cannot be deleted");
    }

    await prisma.damageReport.update({
      where: { id },
      data: { status: DamageStatus.REJECTED },
    });

    await writeModuleAudit({
      userId: user.id,
      action: "DELETE",
      module: "DamageReport",
      details: { entityId: id },
      ...audit,
    });

    return successResponse({ id }, { message: "Damage report rejected" });
  } catch (error) {
    return handleApiError(error);
  }
}
