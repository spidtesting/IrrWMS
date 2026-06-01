import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
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
import { createGINSchema, ginQuerySchema } from "@/lib/validations/gin";

const ginInclude = {
  warehouse: true,
  requisition: { select: { id: true, reqNo: true, status: true } },
  issuedTo: { select: { id: true, fullNameEn: true, employeeId: true } },
  createdBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  approver: { select: { id: true, fullNameEn: true, employeeId: true } },
  lines: {
    include: {
      item: { select: { id: true, itemCode: true, nameEn: true, nameSi: true, unit: true } },
      binLocation: true,
    },
  },
} satisfies Prisma.GoodsIssueNoteInclude;

export async function GET(request: NextRequest) {
  try {
    const user = await requireRouteAccess("outbound");
    const { searchParams } = request.nextUrl;
    const query = ginQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);
    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);

    const where: Prisma.GoodsIssueNoteWhereInput = {
      ...(warehouseId ? { warehouseId } : {}),
      ...(query.issuedToId ? { issuedToId: query.issuedToId } : {}),
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
      prisma.goodsIssueNote.count({ where }),
      prisma.goodsIssueNote.findMany({
        where,
        include: ginInclude,
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
    await requireRouteAccess("outbound");
    const body = createGINSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    resolveWarehouseFilter(user, body.warehouseId);

    const gin = await prisma.goodsIssueNote.create({
      data: {
        ginNo: generateDocumentNumber("GIN"),
        requisitionId: body.requisitionId ?? undefined,
        issuedToId: body.issuedToId,
        warehouseId: body.warehouseId,
        issueDate: body.issueDate ?? undefined,
        remarks: body.remarks,
        createdById: user.id,
        lines: {
          create: body.lines.map((line) => ({
            itemId: line.itemId,
            requestedQty: line.requestedQty,
            issuedQty: line.issuedQty,
            binLocationId: line.binLocationId ?? undefined,
          })),
        },
      },
      include: ginInclude,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "GoodsIssueNote",
      details: { entityId: gin.id, ginNo: gin.ginNo },
      ...audit,
    });

    return successResponse(gin, { status: 201, message: "GIN created" });
  } catch (error) {
    return handleApiError(error);
  }
}
