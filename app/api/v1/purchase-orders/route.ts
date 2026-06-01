import { NextRequest } from "next/server";
import { Prisma, POStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { paginatedResponse, successResponse } from "@/lib/api-response";
import { handleApiError, ConflictError, NotFoundError } from "@/lib/error-handler";
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
  cuidSchema,
  decimalSchema,
  paginationSchema,
  positiveQuantitySchema,
} from "@/lib/validations/common";

const poLineSchema = z.object({
  itemId: cuidSchema,
  quantity: positiveQuantitySchema,
  unitPrice: decimalSchema,
  tax: decimalSchema.optional(),
});

const createPOSchema = z.object({
  supplierId: cuidSchema,
  warehouseId: cuidSchema,
  expectedDate: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
  lines: z.array(poLineSchema).min(1),
});

const poQuerySchema = paginationSchema.extend({
  warehouseId: cuidSchema.optional(),
  supplierId: cuidSchema.optional(),
  status: z.nativeEnum(POStatus).optional(),
});

const poInclude = {
  supplier: true,
  warehouse: true,
  createdBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  approvedBy: { select: { id: true, fullNameEn: true, employeeId: true } },
  lines: {
    include: {
      item: { select: { id: true, itemCode: true, nameEn: true, nameSi: true, unit: true } },
    },
  },
} satisfies Prisma.PurchaseOrderInclude;

export async function GET(request: NextRequest) {
  try {
    const user = await requireRouteAccess("orders");
    const { searchParams } = request.nextUrl;
    const query = poQuerySchema.parse(objectFromSearchParams(searchParams));
    const pagination = parsePagination(searchParams);
    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);

    const where: Prisma.PurchaseOrderWhereInput = {
      ...(warehouseId ? { warehouseId } : {}),
      ...(query.supplierId ? { supplierId: query.supplierId } : {}),
      ...(query.status ? { status: query.status } : {}),
    };

    const [total, data] = await Promise.all([
      prisma.purchaseOrder.count({ where }),
      prisma.purchaseOrder.findMany({
        where,
        include: poInclude,
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
    const user = await requireRole("MANAGER");
    await requireRouteAccess("orders");
    const body = createPOSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    resolveWarehouseFilter(user, body.warehouseId);

    const lines = body.lines.map((line) => {
      const tax = line.tax ?? 0;
      const lineTotal = line.quantity * line.unitPrice + tax;
      return { ...line, tax, lineTotal };
    });

    const totalAmount = lines.reduce((sum, line) => sum + line.lineTotal, 0);

    const po = await prisma.purchaseOrder.create({
      data: {
        poNo: generateDocumentNumber("PO"),
        supplierId: body.supplierId,
        warehouseId: body.warehouseId,
        expectedDate: body.expectedDate,
        notes: body.notes,
        totalAmount: new Decimal(totalAmount),
        createdById: user.id,
        lines: {
          create: lines.map((line) => ({
            itemId: line.itemId,
            quantity: line.quantity,
            unitPrice: new Decimal(line.unitPrice),
            tax: new Decimal(line.tax),
            lineTotal: new Decimal(line.lineTotal),
          })),
        },
      },
      include: poInclude,
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "PurchaseOrder",
      details: { entityId: po.id, poNo: po.poNo },
      ...audit,
    });

    return successResponse(po, { status: 201, message: "Purchase order created" });
  } catch (error) {
    return handleApiError(error);
  }
}
