import { NextRequest } from "next/server";
import { GRNStatus } from "@prisma/client";
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
import { updateGRNSchema, updateGRNStatusSchema } from "@/lib/validations/grn";

type RouteParams = { params: Promise<{ id: string }> };

const grnInclude = {
  supplier: true,
  warehouse: true,
  po: true,
  createdBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  approver: { select: { id: true, fullNameEn: true, employeeId: true } },
  lines: {
    include: {
      item: true,
      lotBatch: true,
    },
  },
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRouteAccess("inbound");
    const { id } = await params;

    const grn = await prisma.goodsReceiptNote.findUnique({
      where: { id },
      include: grnInclude,
    });

    if (!grn) throw new NotFoundError("GRN not found");

    resolveWarehouseFilter(user, grn.warehouseId);

    return successResponse(grn);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("inbound");
    const { id } = await params;
    const audit = getRequestAuditContext(request);
    const raw = await request.json();

    const existing = await prisma.goodsReceiptNote.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("GRN not found");

    resolveWarehouseFilter(user, existing.warehouseId);

    if (raw.status !== undefined) {
      const statusUpdate = updateGRNStatusSchema.parse({ id, ...raw });

      if (
        statusUpdate.status === GRNStatus.APPROVED &&
        existing.status !== GRNStatus.PENDING &&
        existing.status !== GRNStatus.DRAFT
      ) {
        throw new ConflictError("Only draft or pending GRNs can be approved");
      }

      const updated = await prisma.goodsReceiptNote.update({
        where: { id },
        data: {
          status: statusUpdate.status,
          remarks: statusUpdate.remarks ?? existing.remarks,
          ...(statusUpdate.status === GRNStatus.APPROVED
            ? { approverId: user.id, approvedAt: new Date() }
            : {}),
        },
        include: grnInclude,
      });

      await writeModuleAudit({
        userId: user.id,
        action: statusUpdate.status === GRNStatus.APPROVED ? "APPROVE" : "UPDATE",
        module: "GoodsReceiptNote",
        details: { entityId: id, status: statusUpdate.status },
        ...audit,
      });

      return successResponse(updated, { message: "GRN status updated" });
    }

    const body = updateGRNSchema.parse({ id, ...raw });

    if (existing.status !== GRNStatus.DRAFT) {
      throw new ConflictError("Only draft GRNs can be edited");
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (body.lines) {
        await tx.gRNLine.deleteMany({ where: { grnId: id } });
      }

      return tx.goodsReceiptNote.update({
        where: { id },
        data: {
          ...(body.supplierId ? { supplierId: body.supplierId } : {}),
          ...(body.warehouseId ? { warehouseId: body.warehouseId } : {}),
          ...(body.poId !== undefined ? { poId: body.poId } : {}),
          ...(body.receivedDate ? { receivedDate: body.receivedDate } : {}),
          ...(body.remarks !== undefined ? { remarks: body.remarks } : {}),
          ...(body.lines
            ? {
                lines: {
                  create: body.lines.map((line) => ({
                    itemId: line.itemId,
                    orderedQty: line.orderedQty,
                    receivedQty: line.receivedQty,
                    unitPrice: new Decimal(line.unitPrice),
                    lotBatchId: line.lotBatchId ?? undefined,
                  })),
                },
              }
            : {}),
        },
        include: grnInclude,
      });
    });

    await writeModuleAudit({
      userId: user.id,
      action: "UPDATE",
      module: "GoodsReceiptNote",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "GRN updated" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("MANAGER");
    await requireRouteAccess("inbound");
    const { id } = await params;
    const audit = getRequestAuditContext(_request);

    const existing = await prisma.goodsReceiptNote.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("GRN not found");

    resolveWarehouseFilter(user, existing.warehouseId);

    if (existing.status === GRNStatus.APPROVED) {
      throw new ConflictError("Approved GRNs cannot be cancelled");
    }

    const updated = await prisma.goodsReceiptNote.update({
      where: { id },
      data: { status: GRNStatus.CANCELLED },
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CANCEL",
      module: "GoodsReceiptNote",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "GRN cancelled" });
  } catch (error) {
    return handleApiError(error);
  }
}
