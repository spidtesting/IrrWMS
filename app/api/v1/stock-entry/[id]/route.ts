import { NextRequest } from "next/server";
import { EntryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, ConflictError, NotFoundError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import {
  getRequestAuditContext,
  writeModuleAudit,
  resolveWarehouseFilter,
  stockEntryInclude,
} from "@/lib/api/helpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRouteAccess("inventory");
    const { id } = await params;

    const entry = await prisma.stockEntry.findUnique({
      where: { id },
      include: stockEntryInclude,
    });

    if (!entry) throw new NotFoundError("Stock entry not found");

    resolveWarehouseFilter(user, entry.warehouseId);

    return successResponse(entry);
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
    const body = await request.json();

    const existing = await prisma.stockEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Stock entry not found");

    resolveWarehouseFilter(user, existing.warehouseId);

    if (existing.status !== EntryStatus.PENDING) {
      throw new ConflictError("Only pending entries can be updated");
    }

    const updated = await prisma.stockEntry.update({
      where: { id },
      data: {
        ...(body.remarks !== undefined ? { remarks: body.remarks } : {}),
        ...(body.referenceNo !== undefined ? { referenceNo: body.referenceNo } : {}),
      },
      include: stockEntryInclude,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "UPDATE",
      module: "StockEntry",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "Stock entry updated" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("inventory");
    const { id } = await params;
    const audit = getRequestAuditContext(_request);

    const existing = await prisma.stockEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Stock entry not found");

    resolveWarehouseFilter(user, existing.warehouseId);

    if (existing.status !== EntryStatus.PENDING) {
      throw new ConflictError("Only pending entries can be cancelled");
    }

    const updated = await prisma.stockEntry.update({
      where: { id },
      data: { status: EntryStatus.CANCELLED },
      include: stockEntryInclude,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CANCEL",
      module: "StockEntry",
      details: { entityId: id },
      ...audit,
    });

    return successResponse(updated, { message: "Stock entry cancelled" });
  } catch (error) {
    return handleApiError(error);
  }
}
