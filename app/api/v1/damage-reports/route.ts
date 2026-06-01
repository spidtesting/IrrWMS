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
import { createDamageReportSchema, damageReportQuerySchema } from "@/lib/validations/damage-report";

const damageInclude = {
  warehouse: true,
  reportedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  approvedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  lines: {
    include: {
      item: { select: { id: true, itemCode: true, nameEn: true, nameSi: true } },
    },
  },
} satisfies Prisma.DamageReportInclude;

export async function GET(request: NextRequest) {
  try {
    const user = await requireRouteAccess("inventory");
    const { searchParams } = request.nextUrl;
    const query = damageReportQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);
    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);

    const where: Prisma.DamageReportWhereInput = {
      ...(warehouseId ? { warehouseId } : {}),
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
      prisma.damageReport.count({ where }),
      prisma.damageReport.findMany({
        where,
        include: damageInclude,
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
    await requireRouteAccess("inventory");
    const body = createDamageReportSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    resolveWarehouseFilter(user, body.warehouseId);

    const totalCost = body.lines.reduce((sum, line) => sum + line.costImpact, 0);

    const report = await prisma.damageReport.create({
      data: {
        reportNo: generateDocumentNumber("DMG"),
        warehouseId: body.warehouseId,
        reportedById: user.id,
        incidentDate: body.incidentDate,
        remarks: body.remarks,
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
      },
      include: damageInclude,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "DamageReport",
      details: { entityId: report.id, reportNo: report.reportNo },
      ...audit,
    });

    return successResponse(report, { status: 201, message: "Damage report created" });
  } catch (error) {
    return handleApiError(error);
  }
}
