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
import { createSupplierSchema, supplierQuerySchema } from "@/lib/validations/supplier";

export async function GET(request: NextRequest) {
  try {
    await requireRouteAccess("orders");
    const { searchParams } = request.nextUrl;
    const query = supplierQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);

    const where: Prisma.SupplierWhereInput = {
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? {
            OR: [
              { code: { contains: query.search, mode: "insensitive" } },
              { nameEn: { contains: query.search, mode: "insensitive" } },
              { nameSi: { contains: query.search, mode: "insensitive" } },
              { contact: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, data] = await Promise.all([
      prisma.supplier.count({ where }),
      prisma.supplier.findMany({
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
    const user = await requireRole("MANAGER");
    await requireRouteAccess("orders");
    const body = createSupplierSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    const supplier = await prisma.supplier.create({ data: body });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "Supplier",
      details: { entityId: supplier.id, code: supplier.code },
      ...audit,
    });

    return successResponse(supplier, { status: 201, message: "Supplier created" });
  } catch (error) {
    return handleApiError(error);
  }
}
