import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
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
import { createWarehouseSchema, warehouseQuerySchema } from "@/lib/validations/warehouse";

export async function GET(request: NextRequest) {
  try {
    await requireRouteAccess("warehouses");
    const { searchParams } = request.nextUrl;
    const query = warehouseQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);

    const where: Prisma.WarehouseWhereInput = {
      ...(query.district ? { district: { equals: query.district, mode: "insensitive" } } : {}),
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? {
            OR: [
              { code: { contains: query.search, mode: "insensitive" } },
              { nameEn: { contains: query.search, mode: "insensitive" } },
              { nameSi: { contains: query.search, mode: "insensitive" } },
              { district: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, data] = await Promise.all([
      prisma.warehouse.count({ where }),
      prisma.warehouse.findMany({
        where,
        orderBy: { nameEn: "asc" },
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
    const user = await requireRole("ADMIN");
    await requireRouteAccess("warehouses");
    const body = createWarehouseSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    const warehouse = await prisma.warehouse.create({ data: body });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "Warehouse",
      details: { entityId: warehouse.id, code: warehouse.code },
      ...audit,
    });

    return successResponse(warehouse, { status: 201, message: "Warehouse created" });
  } catch (error) {
    return handleApiError(error);
  }
}
