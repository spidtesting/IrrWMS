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
import {
  createPhysicalCountSchema,
  physicalCountQuerySchema,
} from "@/lib/validations/physical-count";

const countInclude = {
  warehouse: true,
  conductedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  approvedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  lines: {
    include: {
      item: { select: { id: true, itemCode: true, nameEn: true, nameSi: true } },
      binLocation: true,
    },
  },
} satisfies Prisma.PhysicalCountCycleInclude;

export async function GET(request: NextRequest) {
  try {
    const user = await requireRouteAccess("inventory");
    const { searchParams } = request.nextUrl;
    const query = physicalCountQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);
    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);

    const where: Prisma.PhysicalCountCycleWhereInput = {
      ...(warehouseId ? { warehouseId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.conductedById ? { conductedById: query.conductedById } : {}),
    };

    const [total, data] = await Promise.all([
      prisma.physicalCountCycle.count({ where }),
      prisma.physicalCountCycle.findMany({
        where,
        include: countInclude,
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
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("inventory");
    const body = createPhysicalCountSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    resolveWarehouseFilter(user, body.warehouseId);

    const cycle = await prisma.physicalCountCycle.create({
      data: {
        cycleNo: generateDocumentNumber("PCC"),
        warehouseId: body.warehouseId,
        conductedById: body.conductedById,
        remarks: body.remarks,
        lines: {
          create: body.lines.map((line) => ({
            itemId: line.itemId,
            binLocationId: line.binLocationId ?? undefined,
            expectedQty: line.expectedQty,
            countedQty: line.countedQty,
            variance:
              line.countedQty !== undefined ? line.countedQty - line.expectedQty : undefined,
            isBlind: line.isBlind,
            notes: line.notes,
          })),
        },
      },
      include: countInclude,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "PhysicalCount",
      details: { entityId: cycle.id, cycleNo: cycle.cycleNo },
      ...audit,
    });

    return successResponse(cycle, { status: 201, message: "Physical count cycle created" });
  } catch (error) {
    return handleApiError(error);
  }
}
