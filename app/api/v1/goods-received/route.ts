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
  objectFromSearchParams,
} from "@/lib/api/helpers";
import { createGRNSchema, grnQuerySchema } from "@/lib/validations/grn";

const grnInclude = {
  supplier: true,
  warehouse: true,
  po: { select: { id: true, poNo: true, status: true } },
  createdBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  approver: { select: { id: true, fullNameEn: true, employeeId: true } },
  lines: {
    include: {
      item: { select: { id: true, itemCode: true, nameEn: true, nameSi: true, unit: true } },
      lotBatch: true,
    },
  },
} satisfies Prisma.GoodsReceiptNoteInclude;

export async function GET(request: NextRequest) {
  try {
    const user = await requireRouteAccess("inbound");
    const { searchParams } = request.nextUrl;
    const query = grnQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);
    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);

    const where: Prisma.GoodsReceiptNoteWhereInput = {
      ...(warehouseId ? { warehouseId } : {}),
      ...(query.supplierId ? { supplierId: query.supplierId } : {}),
      ...(query.status ? { status: query.status } : {}),
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
      prisma.goodsReceiptNote.count({ where }),
      prisma.goodsReceiptNote.findMany({
        where,
        include: grnInclude,
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
  try {
    const user = await requireRole("STAFF");
    await requireRouteAccess("inbound");
    const body = createGRNSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    resolveWarehouseFilter(user, body.warehouseId);

    const totalAmount = body.lines.reduce(
      (sum, line) => sum + line.receivedQty * line.unitPrice,
      0,
    );

    const grn = await prisma.goodsReceiptNote.create({
      data: {
        grnNo: generateDocumentNumber("GRN"),
        supplierId: body.supplierId,
        warehouseId: body.warehouseId,
        poId: body.poId ?? undefined,
        receivedDate: body.receivedDate ?? undefined,
        remarks: body.remarks,
        createdById: user.id,
        lines: {
          create: body.lines.map((line) => ({
            itemId: line.itemId,
            orderedQty: line.orderedQty,
            receivedQty: line.receivedQty,
            unitPrice: new Decimal(line.unitPrice),
            lotBatchId: line.lotBatchId ?? undefined,
          })),
        },
      },
      include: grnInclude,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "GoodsReceiptNote",
      details: { entityId: grn.id, grnNo: grn.grnNo, totalAmount },
      ...audit,
    });

    return successResponse(grn, { status: 201, message: "GRN created" });
  } catch (error) {
    return handleApiError(error);
  }
}
