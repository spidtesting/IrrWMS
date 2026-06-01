import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { paginatedResponse, successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import { parsePagination, buildPaginationMeta } from "@/lib/pagination";
import {
  getRequestAuditContext,
  writeModuleAudit,
  objectFromSearchParams,
} from "@/lib/api/helpers";
import { paginationSchema } from "@/lib/validations/common";

const createCategorySchema = z.object({
  code: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[A-Z0-9-]+$/, "Code must be uppercase alphanumeric with hyphens"),
  nameEn: z.string().min(2).max(255),
  nameSi: z.string().min(2).max(255),
});

const categoryQuerySchema = paginationSchema.extend({
  search: z.string().trim().max(100).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRouteAccess("inventory");
    const { searchParams } = request.nextUrl;
    const query = categoryQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);

    const where = query.search
      ? {
          OR: [
            { code: { contains: query.search, mode: "insensitive" as const } },
            { nameEn: { contains: query.search, mode: "insensitive" as const } },
            { nameSi: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [total, data] = await Promise.all([
      prisma.category.count({ where }),
      prisma.category.findMany({
        where,
        orderBy: { nameEn: "asc" },
        skip: pagination.skip,
        take: pagination.limit,
        include: { _count: { select: { items: true } } },
      }),
    ]);

    return paginatedResponse(data, buildPaginationMeta(total, pagination));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("ADMIN");
    await requireRouteAccess("inventory");
    const body = createCategorySchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    const category = await prisma.category.create({ data: body });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "Category",
      details: { entityId: category.id, code: category.code },
      ...audit,
    });

    return successResponse(category, { status: 201, message: "Category created" });
  } catch (error) {
    return handleApiError(error);
  }
}
