import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";
import { paginatedResponse, successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import { parsePagination, buildPaginationMeta } from "@/lib/pagination";
import {
  generateDocumentNumber,
  getRequestAuditContext,
  writeModuleAudit,
  resolveWarehouseFilter,
  stockEntryInclude,
  objectFromSearchParams,
} from "@/lib/api/helpers";
import { createStockEntrySchema, stockEntryQuerySchema } from "@/lib/validations/stock-entry";
import {
  beginIdempotency,
  completeIdempotency,
  failIdempotency,
  getIdempotencyKeyFromRequest,
} from "@/lib/idempotency";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRouteAccess("inventory");
    const { searchParams } = request.nextUrl;
    const query = stockEntryQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);
    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);

    const where: Prisma.StockEntryWhereInput = {
      ...(warehouseId ? { warehouseId } : {}),
      ...(query.itemId ? { itemId: query.itemId } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.createdById ? { createdById: query.createdById } : {}),
      ...(query.fromDate || query.toDate
        ? {
            createdAt: {
              ...(query.fromDate ? { gte: query.fromDate } : {}),
              ...(query.toDate ? { lte: query.toDate } : {}),
            },
          }
        : {}),
    };

    const [total, data] = await Promise.all([
      prisma.stockEntry.count({ where }),
      prisma.stockEntry.findMany({
        where,
        include: stockEntryInclude,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.limit,
      }),
    ]);

    return paginatedResponse(data, buildPaginationMeta(total, pagination));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  const idempotencyKey = getIdempotencyKeyFromRequest(request);

  try {
    const user = await requireRole("STAFF");
    await requireRouteAccess("inventory");
    const body = createStockEntrySchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    resolveWarehouseFilter(user, body.warehouseId);

    const key = body.idempotencyKey ?? idempotencyKey;
    if (key) await beginIdempotency(key);

    const totalValue = body.unitPrice !== undefined ? body.quantity * body.unitPrice : undefined;

    const entry = await prisma.stockEntry.create({
      data: {
        entryNumber: generateDocumentNumber("SE"),
        type: body.type,
        itemId: body.itemId,
        warehouseId: body.warehouseId,
        quantity: body.quantity,
        unitPrice: body.unitPrice !== undefined ? new Decimal(body.unitPrice) : undefined,
        totalValue: totalValue !== undefined ? new Decimal(totalValue) : undefined,
        referenceNo: body.referenceNo,
        remarks: body.remarks,
        entryMethod: body.entryMethod,
        grnId: body.grnId,
        ginId: body.ginId,
        createdById: user.id,
        idempotencyKey: key ?? undefined,
      },
      include: stockEntryInclude,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "StockEntry",
      details: { entityId: entry.id, entryNumber: entry.entryNumber },
      ...audit,
    });

    if (key) await completeIdempotency(key, entry);

    return successResponse(entry, { status: 201, message: "Stock entry created" });
  } catch (error) {
    if (idempotencyKey) await failIdempotency(idempotencyKey);
    return handleApiError(error);
  }
}
