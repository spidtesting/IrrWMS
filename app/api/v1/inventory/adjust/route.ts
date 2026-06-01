import { NextRequest } from "next/server";
import { EntryStatus, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, NotFoundError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import {
  generateDocumentNumber,
  getRequestAuditContext,
  writeModuleAudit,
  resolveWarehouseFilter,
  stockEntryInclude,
} from "@/lib/api/helpers";
import { inventoryAdjustSchema } from "@/lib/validations/inventory";
import {
  beginIdempotency,
  completeIdempotency,
  failIdempotency,
  getIdempotencyKeyFromRequest,
} from "@/lib/idempotency";

export async function POST(request: NextRequest) {
  let idempotencyKey: string | null = getIdempotencyKeyFromRequest(request);

  try {
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("inventory");
    const body = inventoryAdjustSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    idempotencyKey = body.idempotencyKey ?? idempotencyKey ?? null;

    resolveWarehouseFilter(user, body.warehouseId);

    if (idempotencyKey) {
      await beginIdempotency(idempotencyKey);
    }

    const inventory = await prisma.inventory.findUnique({
      where: {
        itemId_warehouseId: {
          itemId: body.itemId,
          warehouseId: body.warehouseId,
        },
      },
    });

    if (!inventory) {
      throw new NotFoundError("Inventory record not found");
    }

    const entry = await prisma.stockEntry.create({
      data: {
        entryNumber: generateDocumentNumber("ADJ"),
        type: TransactionType.STOCK_ADJUSTMENT,
        itemId: body.itemId,
        warehouseId: body.warehouseId,
        quantity: Math.abs(body.quantity),
        remarks: `${body.reason} (${body.quantity > 0 ? "increase" : "decrease"}: ${Math.abs(body.quantity)})`,
        referenceNo: body.reason.slice(0, 50),
        createdById: user.id,
        status: EntryStatus.PENDING,
        idempotencyKey: idempotencyKey ?? undefined,
      },
      include: stockEntryInclude,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "StockAdjustment",
      details: {
        entityId: entry.id,
        itemId: body.itemId,
        warehouseId: body.warehouseId,
        quantity: body.quantity,
      },
      ...audit,
    });

    if (idempotencyKey) {
      await completeIdempotency(idempotencyKey, entry);
    }

    return successResponse(entry, {
      status: 201,
      message: "Stock adjustment submitted for approval",
    });
  } catch (error) {
    if (idempotencyKey) {
      await failIdempotency(idempotencyKey);
    }
    return handleApiError(error);
  }
}
