import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError, NotFoundError, ValidationError } from "@/lib/error-handler";
import { requireRouteAccess } from "@/lib/auth-guard";
import { resolveWarehouseFilter } from "@/lib/api/helpers";

const querySchema = z.object({
  barcode: z.string().min(1).max(50),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireRouteAccess("inventory");
    const parsed = querySchema.safeParse({
      barcode: request.nextUrl.searchParams.get("barcode") ?? "",
    });

    if (!parsed.success) {
      throw new ValidationError("Barcode is required");
    }

    const item = await prisma.item.findFirst({
      where: {
        barcode: parsed.data.barcode.trim(),
        isActive: true,
        deletedAt: null,
      },
      include: {
        category: {
          select: { id: true, code: true, nameEn: true, nameSi: true },
        },
      },
    });

    if (!item) {
      throw new NotFoundError("Item not found for this barcode");
    }

    resolveWarehouseFilter(user, item.warehouseId);

    return successResponse({
      id: item.id,
      itemCode: item.itemCode,
      nameEn: item.nameEn,
      nameSi: item.nameSi,
      barcode: item.barcode,
      unit: item.unit,
      unitPrice: item.unitPrice,
      warehouseId: item.warehouseId,
      category: item.category,
      imageUrl: item.imageUrl,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
