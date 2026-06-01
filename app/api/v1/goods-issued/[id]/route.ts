import { NextRequest } from "next/server";
import { GINStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, ConflictError, NotFoundError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import {
  getRequestAuditContext,
  writeModuleAudit,
  resolveWarehouseFilter,
} from "@/lib/api/helpers";
import { updateGINSchema, updateGINStatusSchema } from "@/lib/validations/gin";

type RouteParams = { params: Promise<{ id: string }> };

const ginInclude = {
  warehouse: true,
  requisition: true,
  issuedTo: { select: { id: true, fullNameEn: true, employeeId: true } },
  createdBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  approver: { select: { id: true, fullNameEn: true, employeeId: true } },
  lines: { include: { item: true, binLocation: true } },
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRouteAccess("outbound");
    const { id } = await params;

    const gin = await prisma.goodsIssueNote.findUnique({
      where: { id },
      include: ginInclude,
    });

    if (!gin) throw new NotFoundError("GIN not found");

    resolveWarehouseFilter(user, gin.warehouseId);

    return successResponse(gin);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("outbound");
    const { id } = await params;
    const audit = getRequestAuditContext(request);
    const raw = await request.json();

    const existing = await prisma.goodsIssueNote.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("GIN not found");

    resolveWarehouseFilter(user, existing.warehouseId);

    if (raw.status !== undefined) {
      const statusUpdate = updateGINStatusSchema.parse({ id, ...raw });

      const updated = await prisma.goodsIssueNote.update({
        where: { id },
        data: {
          status: statusUpdate.status,
          remarks: statusUpdate.remarks ?? existing.remarks,
          ...(statusUpdate.status === GINStatus.APPROVED
            ? { approverId: user.id, approvedAt: new Date() }
            : {}),
        },
        include: ginInclude,
      });

      await writeModuleAudit({
        userId: user.id,
        action: statusUpdate.status === GINStatus.APPROVED ? "APPROVE" : "UPDATE",
        module: "GoodsIssueNote",
        details: { entityId: id, status: statusUpdate.status },
        ...audit,
      });

      return successResponse(updated, { message: "GIN status updated" });
    }

    const body = updateGINSchema.parse({ id, ...raw });

    if (existing.status !== GINStatus.DRAFT) {
      throw new ConflictError("Only draft GINs can be edited");
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (body.lines) {
        await tx.gINLine.deleteMany({ where: { ginId: id } });
      }

      return tx.goodsIssueNote.update({
        where: { id },
        data: {
          ...(body.requisitionId !== undefined ? { requisitionId: body.requisitionId } : {}),
          ...(body.issuedToId ? { issuedToId: body.issuedToId } : {}),
          ...(body.warehouseId ? { warehouseId: body.warehouseId } : {}),
          ...(body.issueDate ? { issueDate: body.issueDate } : {}),
          ...(body.remarks !== undefined ? { remarks: body.remarks } : {}),
          ...(body.lines
            ? {
                lines: {
                  create: body.lines.map((line) => ({
                    itemId: line.itemId,
                    requestedQty: line.requestedQty,
                    issuedQty: line.issuedQty,
                    binLocationId: line.binLocationId ?? undefined,
                  })),
                },
              }
            : {}),
        },
        include: ginInclude,
      });
    });

    await writeModuleAudit({
      userId: user.id,
      action: "UPDATE",
      module: "GoodsIssueNote",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "GIN updated" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("MANAGER");
    await requireRouteAccess("outbound");
    const { id } = await params;
    const audit = getRequestAuditContext(_request);

    const existing = await prisma.goodsIssueNote.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("GIN not found");

    resolveWarehouseFilter(user, existing.warehouseId);

    if (existing.status === GINStatus.APPROVED) {
      throw new ConflictError("Approved GINs cannot be cancelled");
    }

    const updated = await prisma.goodsIssueNote.update({
      where: { id },
      data: { status: GINStatus.CANCELLED },
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CANCEL",
      module: "GoodsIssueNote",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "GIN cancelled" });
  } catch (error) {
    return handleApiError(error);
  }
}
