import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paginatedResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess } from "@/lib/auth-guard";
import { parsePagination, buildPaginationMeta } from "@/lib/pagination";
import { resolveWarehouseFilter, objectFromSearchParams } from "@/lib/api/helpers";
import { reportQuerySchema } from "@/lib/validations/report";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRouteAccess("reports");
    const { searchParams } = request.nextUrl;
    const query = reportQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);
    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);

    const where: Prisma.ReportWhereInput = {
      ...(warehouseId ? { warehouseId } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.generatedById ? { generatedById: query.generatedById } : {}),
      ...(query.fromDate || query.toDate
        ? {
            fromDate: query.fromDate ? { gte: query.fromDate } : undefined,
            toDate: query.toDate ? { lte: query.toDate } : undefined,
          }
        : {}),
    };

    const [total, data] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.findMany({
        where,
        include: {
          warehouse: { select: { id: true, code: true, nameEn: true } },
          generatedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
        },
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
