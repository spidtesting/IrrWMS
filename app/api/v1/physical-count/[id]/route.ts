import { NextRequest } from "next/server";
import { CountStatus } from "@prisma/client";
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
  approvePhysicalCountSchema,
  updateCountLineSchema,
  updateCountStatusSchema,
} from "@/lib/validations/physical-count";

type RouteParams = { params: Promise<{ id: string }> };

const countInclude = {
  warehouse: true,
  conductedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  approvedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  lines: { include: { item: true, binLocation: true } },
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRouteAccess("inventory");
    const { id } = await params;

    const cycle = await prisma.physicalCountCycle.findUnique({
      where: { id },
      include: countInclude,
    });

    if (!cycle) throw new NotFoundError("Physical count cycle not found");

    resolveWarehouseFilter(user, cycle.warehouseId);

    return successResponse(cycle);
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

    const existing = await prisma.physicalCountCycle.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Physical count cycle not found");

    resolveWarehouseFilter(user, existing.warehouseId);

    if (raw.lineId) {
      const lineUpdate = updateCountLineSchema.parse(raw);
      const line = await prisma.physicalCountLine.findFirst({
        where: { id: lineUpdate.lineId, cycleId: id },
      });

      if (!line) throw new NotFoundError("Count line not found");

      const countedQty = lineUpdate.recountedQty ?? lineUpdate.countedQty;
      const updatedLine = await prisma.physicalCountLine.update({
        where: { id: lineUpdate.lineId },
        data: {
          countedQty,
          recountedQty: lineUpdate.recountedQty,
          variance: countedQty - line.expectedQty,
          notes: lineUpdate.notes ?? line.notes,
        },
      });

      return successResponse(updatedLine, { message: "Count line updated" });
    }

    if (raw.status !== undefined) {
      const statusUpdate = updateCountStatusSchema.parse({ id, ...raw });

      const updated = await prisma.physicalCountCycle.update({
        where: { id },
        data: {
          status: statusUpdate.status,
          remarks: statusUpdate.remarks ?? existing.remarks,
          ...(statusUpdate.status === CountStatus.IN_PROGRESS ? { startedAt: new Date() } : {}),
          ...(statusUpdate.status === CountStatus.COMPLETED ? { completedAt: new Date() } : {}),
          ...(statusUpdate.status === CountStatus.APPROVED
            ? { approvedById: user.id, approvedAt: new Date() }
            : {}),
        },
        include: countInclude,
      });

      await writeModuleAudit({
        userId: user.id,
        action: statusUpdate.status === CountStatus.APPROVED ? "APPROVE" : "UPDATE",
        module: "PhysicalCount",
        details: { entityId: id, status: statusUpdate.status },
        ...audit,
      });

      return successResponse(updated, { message: "Count cycle status updated" });
    }

    if (raw.action === "approve") {
      const approve = approvePhysicalCountSchema.parse({ id, ...raw });

      if (existing.status !== CountStatus.COMPLETED) {
        throw new ConflictError("Only completed cycles can be approved");
      }

      const updated = await prisma.physicalCountCycle.update({
        where: { id },
        data: {
          status: CountStatus.APPROVED,
          approvedById: user.id,
          approvedAt: new Date(),
          remarks: approve.remarks ?? existing.remarks,
        },
        include: countInclude,
      });

      await writeModuleAudit({
        userId: user.id,
        action: "APPROVE",
        module: "PhysicalCount",
        details: { entityId: id },
        ...audit,
      });

      return successResponse(updated, { message: "Physical count approved" });
    }

    throw new ConflictError("Unsupported update payload");
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

    const existing = await prisma.physicalCountCycle.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Physical count cycle not found");

    resolveWarehouseFilter(user, existing.warehouseId);

    if (existing.status === CountStatus.APPROVED) {
      throw new ConflictError("Approved count cycles cannot be cancelled");
    }

    const updated = await prisma.physicalCountCycle.update({
      where: { id },
      data: { status: CountStatus.CANCELLED },
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CANCEL",
      module: "PhysicalCount",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "Physical count cycle cancelled" });
  } catch (error) {
    return handleApiError(error);
  }
}
