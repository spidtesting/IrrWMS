import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { paginatedResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess } from "@/lib/auth-guard";
import { parsePagination, buildPaginationMeta } from "@/lib/pagination";
import { objectFromSearchParams } from "@/lib/api/helpers";
import { cuidSchema, paginationSchema } from "@/lib/validations/common";

const auditLogQuerySchema = paginationSchema.extend({
  userId: cuidSchema.optional(),
  module: z.string().trim().max(100).optional(),
  action: z.string().trim().max(50).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRouteAccess("audit-logs");
    const { searchParams } = request.nextUrl;
    const query = auditLogQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams, { defaultLimit: 50, maxLimit: 200 });

    const where: Prisma.AuditLogWhereInput = {
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.module ? { module: { equals: query.module, mode: "insensitive" } } : {}),
      ...(query.action ? { action: { equals: query.action, mode: "insensitive" } } : {}),
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
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              employeeId: true,
              fullNameEn: true,
              role: true,
            },
          },
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
