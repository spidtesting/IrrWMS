import { NextRequest } from "next/server";
import { POStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, ConflictError, NotFoundError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import {
  getRequestAuditContext,
  writeModuleAudit,
  resolveWarehouseFilter,
} from "@/lib/api/helpers";
import { cuidSchema, decimalSchema, positiveQuantitySchema } from "@/lib/validations/common";

type RouteParams = { params: Promise<{ id: string }> };

const updatePOSchema = z.object({
  supplierId: cuidSchema.optional(),
  warehouseId: cuidSchema.optional(),
  expectedDate: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
  status: z.nativeEnum(POStatus).optional(),
  lines: z
    .array(
      z.object({
        itemId: cuidSchema,
        quantity: positiveQuantitySchema,
        unitPrice: decimalSchema,
        tax: decimalSchema.optional(),
      }),
    )
    .optional(),
});

const poInclude = {
  supplier: true,
  warehouse: true,
  createdBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  approvedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  lines: { include: { item: true } },
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRouteAccess("orders");
    const { id } = await params;

    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: poInclude,
    });

    if (!po) throw new NotFoundError("Purchase order not found");

    resolveWarehouseFilter(user, po.warehouseId);

    return successResponse(po);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("MANAGER");
    await requireRouteAccess("orders");
    const { id } = await params;
    const body = updatePOSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    const existing = await prisma.purchaseOrder.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Purchase order not found");

    resolveWarehouseFilter(user, existing.warehouseId);

    if (
      existing.status !== POStatus.DRAFT &&
      existing.status !== POStatus.SUBMITTED &&
      body.lines
    ) {
      throw new ConflictError("Cannot edit lines after PO is approved");
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (body.lines) {
        await tx.pOLine.deleteMany({ where: { poId: id } });
      }

      let totalAmount = existing.totalAmount;
      if (body.lines) {
        const lineTotals = body.lines.map((line) => {
          const tax = line.tax ?? 0;
          return line.quantity * line.unitPrice + tax;
        });
        totalAmount = new Decimal(lineTotals.reduce((a, b) => a + b, 0));
      }

      return tx.purchaseOrder.update({
        where: { id },
        data: {
          ...(body.supplierId ? { supplierId: body.supplierId } : {}),
          ...(body.warehouseId ? { warehouseId: body.warehouseId } : {}),
          ...(body.expectedDate ? { expectedDate: body.expectedDate } : {}),
          ...(body.notes !== undefined ? { notes: body.notes } : {}),
          ...(body.status ? { status: body.status } : {}),
          ...(body.status === POStatus.APPROVED
            ? { approvedById: user.id, approvedAt: new Date() }
            : {}),
          ...(body.lines
            ? {
                totalAmount,
                lines: {
                  create: body.lines.map((line) => {
                    const tax = line.tax ?? 0;
                    const lineTotal = line.quantity * line.unitPrice + tax;
                    return {
                      itemId: line.itemId,
                      quantity: line.quantity,
                      unitPrice: new Decimal(line.unitPrice),
                      tax: new Decimal(tax),
                      lineTotal: new Decimal(lineTotal),
                    };
                  }),
                },
              }
            : {}),
        },
        include: poInclude,
      });
    });

    await writeModuleAudit({
      userId: user.id,
      action: body.status === POStatus.APPROVED ? "APPROVE" : "UPDATE",
      module: "PurchaseOrder",
      details: { entityId: id, status: body.status },
      ...audit,
    });

    return successResponse(updated, { message: "Purchase order updated" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("MANAGER");
    await requireRouteAccess("orders");
    const { id } = await params;
    const audit = getRequestAuditContext(_request);

    const existing = await prisma.purchaseOrder.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Purchase order not found");

    resolveWarehouseFilter(user, existing.warehouseId);

    if (existing.status === POStatus.RECEIVED || existing.status === POStatus.PARTIALLY_RECEIVED) {
      throw new ConflictError("Received purchase orders cannot be cancelled");
    }

    const updated = await prisma.purchaseOrder.update({
      where: { id },
      data: { status: POStatus.CANCELLED },
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CANCEL",
      module: "PurchaseOrder",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "Purchase order cancelled" });
  } catch (error) {
    return handleApiError(error);
  }
}
