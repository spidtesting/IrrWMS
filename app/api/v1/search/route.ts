import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireAuth } from "@/lib/auth-guard";
import { resolveWarehouseFilter } from "@/lib/api/helpers";
import { cuidSchema } from "@/lib/validations/common";

const searchQuerySchema = z.object({
  q: z.string().trim().min(2).max(100),
  warehouseId: cuidSchema.optional(),
  limit: z.coerce.number().int().positive().max(20).default(10),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = request.nextUrl;
    const query = searchQuerySchema.parse({
      q: searchParams.get("q"),
      warehouseId: searchParams.get("warehouseId") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);
    const take = query.limit;

    const [items, suppliers, warehouses, staff, grns, gins] = await Promise.all([
      prisma.item.findMany({
        where: {
          isActive: true,
          deletedAt: null,
          ...(warehouseId ? { warehouseId } : {}),
          OR: [
            { itemCode: { contains: query.q, mode: "insensitive" } },
            { nameEn: { contains: query.q, mode: "insensitive" } },
            { nameSi: { contains: query.q, mode: "insensitive" } },
            { barcode: { contains: query.q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          itemCode: true,
          nameEn: true,
          nameSi: true,
          barcode: true,
        },
        take,
      }),
      prisma.supplier.findMany({
        where: {
          isActive: true,
          OR: [
            { code: { contains: query.q, mode: "insensitive" } },
            { nameEn: { contains: query.q, mode: "insensitive" } },
            { nameSi: { contains: query.q, mode: "insensitive" } },
          ],
        },
        select: { id: true, code: true, nameEn: true, nameSi: true },
        take,
      }),
      prisma.warehouse.findMany({
        where: {
          isActive: true,
          OR: [
            { code: { contains: query.q, mode: "insensitive" } },
            { nameEn: { contains: query.q, mode: "insensitive" } },
            { nameSi: { contains: query.q, mode: "insensitive" } },
            { district: { contains: query.q, mode: "insensitive" } },
          ],
        },
        select: { id: true, code: true, nameEn: true, nameSi: true, district: true },
        take,
      }),
      ["SUPER_ADMIN", "ADMIN", "MANAGER"].includes(user.role)
        ? prisma.user.findMany({
            where: {
              deletedAt: null,
              isActive: true,
              ...(warehouseId ? { warehouseId } : {}),
              OR: [
                { employeeId: { contains: query.q, mode: "insensitive" } },
                { fullNameEn: { contains: query.q, mode: "insensitive" } },
                { fullNameSi: { contains: query.q, mode: "insensitive" } },
                { email: { contains: query.q, mode: "insensitive" } },
              ],
            },
            select: {
              id: true,
              employeeId: true,
              fullNameEn: true,
              fullNameSi: true,
              email: true,
              role: true,
            },
            take,
          })
        : Promise.resolve([]),
      prisma.goodsReceiptNote.findMany({
        where: {
          ...(warehouseId ? { warehouseId } : {}),
          grnNo: { contains: query.q, mode: "insensitive" },
        },
        select: { id: true, grnNo: true, status: true, createdAt: true },
        take,
      }),
      prisma.goodsIssueNote.findMany({
        where: {
          ...(warehouseId ? { warehouseId } : {}),
          ginNo: { contains: query.q, mode: "insensitive" },
        },
        select: { id: true, ginNo: true, status: true, createdAt: true },
        take,
      }),
    ]);

    return successResponse({
      query: query.q,
      results: {
        items: items.map((item) => ({ ...item, type: "item" as const })),
        suppliers: suppliers.map((s) => ({ ...s, type: "supplier" as const })),
        warehouses: warehouses.map((w) => ({ ...w, type: "warehouse" as const })),
        staff: staff.map((s) => ({ ...s, type: "staff" as const })),
        goodsReceived: grns.map((g) => ({ ...g, type: "grn" as const })),
        goodsIssued: gins.map((g) => ({ ...g, type: "gin" as const })),
      },
      counts: {
        items: items.length,
        suppliers: suppliers.length,
        warehouses: warehouses.length,
        staff: staff.length,
        goodsReceived: grns.length,
        goodsIssued: gins.length,
        total:
          items.length +
          suppliers.length +
          warehouses.length +
          staff.length +
          grns.length +
          gins.length,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
