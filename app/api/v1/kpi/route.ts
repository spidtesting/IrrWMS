import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess } from "@/lib/auth-guard";
import { resolveWarehouseFilter, objectFromSearchParams } from "@/lib/api/helpers";
import { aggregateKpiRecords, scoreKpiRecord } from "@/lib/utils/kpi-calculator";
import { kpiReportParamsSchema } from "@/lib/validations/report";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRouteAccess("reports");
    const { searchParams } = request.nextUrl;
    const query = kpiReportParamsSchema.parse(objectFromSearchParams(searchParams));
    const warehouseId = resolveWarehouseFilter(user, query.warehouseId);

    const where = {
      warehouseId: warehouseId ?? query.warehouseId,
      year: query.year,
      ...(query.month ? { month: query.month } : {}),
    };

    const records = await prisma.kPIRecord.findMany({
      where,
      orderBy: [{ year: "desc" }, { month: "desc" }],
      include: {
        warehouse: { select: { id: true, code: true, nameEn: true } },
      },
    });

    const latest = records[0] ?? null;
    const aggregated = aggregateKpiRecords(records);
    const scorecard = latest ? scoreKpiRecord(latest) : [];

    const pendingApprovals = await Promise.all([
      prisma.stockEntry.count({
        where: {
          ...(warehouseId ? { warehouseId } : {}),
          status: "PENDING",
        },
      }),
      prisma.goodsReceiptNote.count({
        where: {
          ...(warehouseId ? { warehouseId } : {}),
          status: "PENDING",
        },
      }),
      prisma.goodsIssueNote.count({
        where: {
          ...(warehouseId ? { warehouseId } : {}),
          status: "PENDING",
        },
      }),
    ]);

    const lowStockCount = await prisma.inventory.count({
      where: {
        ...(warehouseId ? { warehouseId } : {}),
        item: { isActive: true, deletedAt: null, reorderLevel: { gt: 0 } },
        currentStock: { lte: 0 },
      },
    });

    return successResponse({
      records,
      latest,
      aggregated,
      scorecard,
      alerts: {
        pendingStockEntries: pendingApprovals[0],
        pendingGRNs: pendingApprovals[1],
        pendingGINs: pendingApprovals[2],
        lowStockItems: lowStockCount,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
