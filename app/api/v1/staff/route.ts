import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paginatedResponse, successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import { parsePagination, buildPaginationMeta } from "@/lib/pagination";
import { hashPassword } from "@/lib/auth";
import {
  getRequestAuditContext,
  writeModuleAudit,
  resolveWarehouseFilter,
  objectFromSearchParams,
} from "@/lib/api/helpers";
import { createUserSchema, userQuerySchema } from "@/lib/validations/user";

const staffSelect = {
  id: true,
  employeeId: true,
  fullNameEn: true,
  fullNameSi: true,
  email: true,
  role: true,
  warehouseId: true,
  isActive: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
  warehouse: { select: { id: true, code: true, nameEn: true } },
} satisfies Prisma.UserSelect;

export async function GET(request: NextRequest) {
  try {
    const user = await requireRouteAccess("users");
    const { searchParams } = request.nextUrl;
    const query = userQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);
    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(query.role ? { role: query.role } : {}),
      ...(warehouseId ? { warehouseId } : {}),
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? {
            OR: [
              { employeeId: { contains: query.search, mode: "insensitive" } },
              { fullNameEn: { contains: query.search, mode: "insensitive" } },
              { fullNameSi: { contains: query.search, mode: "insensitive" } },
              { email: { contains: query.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, data] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: staffSelect,
        orderBy: { fullNameEn: "asc" },
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
    await requireRouteAccess("users");
    const body = createUserSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    const passwordHash = await hashPassword(body.password);

    const staff = await prisma.user.create({
      data: {
        employeeId: body.employeeId,
        fullNameEn: body.fullNameEn,
        fullNameSi: body.fullNameSi,
        email: body.email,
        password: passwordHash,
        role: body.role,
        warehouseId: body.warehouseId ?? undefined,
        isActive: body.isActive,
      },
      select: staffSelect,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "User",
      details: { entityId: staff.id, employeeId: staff.employeeId },
      ...audit,
    });

    return successResponse(staff, { status: 201, message: "Staff member created" });
  } catch (error) {
    return handleApiError(error);
  }
}
