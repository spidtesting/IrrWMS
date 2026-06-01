import { NextRequest } from "next/server";
import { ReportType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { handleApiError } from "@/lib/error-handler";
import { requireRouteAccess, requireRole } from "@/lib/auth-guard";
import {
  generateDocumentNumber,
  getRequestAuditContext,
  writeModuleAudit,
  resolveWarehouseFilter,
} from "@/lib/api/helpers";
import { generateReportSchema } from "@/lib/validations/report";
import { calculatePareto, paretoFromInventory } from "@/lib/utils/pareto";
import {
  aggregateKpiRecords,
  calculateAvgEntryTime,
  calculateOrderFulfillmentRate,
} from "@/lib/utils/kpi-calculator";

async function buildReportMetadata(
  type: ReportType,
  warehouseId: string,
  fromDate: Date,
  toDate: Date,
) {
  switch (type) {
    case ReportType.DAILY_STOCK: {
      const inventories = await prisma.inventory.findMany({
        where: { warehouseId, item: { isActive: true, deletedAt: null } },
        include: {
          item: {
            select: {
              id: true,
              nameEn: true,
              unitPrice: true,
              itemCode: true,
            },
          },
        },
      });

      return {
        totalItems: inventories.length,
        totalStock: inventories.reduce((sum, inv) => sum + inv.currentStock, 0),
        totalValue: inventories.reduce(
          (sum, inv) => sum + inv.currentStock * Number(inv.item.unitPrice),
          0,
        ),
      };
    }

    case ReportType.MONTHLY_KPI: {
      const records = await prisma.kPIRecord.findMany({
        where: {
          warehouseId,
          recordDate: { gte: fromDate, lte: toDate },
        },
      });
      return { kpi: aggregateKpiRecords(records), recordCount: records.length };
    }

    case ReportType.PARETO_ANALYSIS: {
      const inventories = await prisma.inventory.findMany({
        where: { warehouseId, item: { isActive: true, deletedAt: null } },
        include: { item: { select: { id: true, nameEn: true, unitPrice: true } } },
      });

      const items = paretoFromInventory(
        inventories.map((inv) => ({
          itemId: inv.item.id,
          label: inv.item.nameEn,
          unitPrice: Number(inv.item.unitPrice),
          currentStock: inv.currentStock,
        })),
      );

      return { pareto: calculatePareto(items) };
    }

    case ReportType.STAFF_PRODUCTIVITY: {
      const entries = await prisma.stockEntry.findMany({
        where: {
          warehouseId,
          createdAt: { gte: fromDate, lte: toDate },
        },
        select: { entryDuration: true, status: true, type: true, createdById: true },
      });

      const byUser = entries.reduce<Record<string, number>>((acc, entry) => {
        acc[entry.createdById] = (acc[entry.createdById] ?? 0) + 1;
        return acc;
      }, {});

      return {
        avgEntryTime: calculateAvgEntryTime(entries),
        entriesByUser: byUser,
        totalEntries: entries.length,
      };
    }

    case ReportType.DAMAGE_REPORT: {
      const reports = await prisma.damageReport.findMany({
        where: {
          warehouseId,
          createdAt: { gte: fromDate, lte: toDate },
        },
        include: { lines: true },
      });

      return {
        reportCount: reports.length,
        totalCost: reports.reduce((sum, r) => sum + Number(r.totalCost), 0),
      };
    }

    case ReportType.ANNUAL_INVENTORY: {
      const [entries, inventories] = await Promise.all([
        prisma.stockEntry.count({
          where: { warehouseId, createdAt: { gte: fromDate, lte: toDate } },
        }),
        prisma.inventory.count({ where: { warehouseId } }),
      ]);

      const fulfilledGins = await prisma.goodsIssueNote.count({
        where: {
          warehouseId,
          status: "APPROVED",
          createdAt: { gte: fromDate, lte: toDate },
        },
      });

      const totalGins = await prisma.goodsIssueNote.count({
        where: { warehouseId, createdAt: { gte: fromDate, lte: toDate } },
      });

      return {
        stockMovements: entries,
        skuCount: inventories,
        orderFulfillmentRate: calculateOrderFulfillmentRate(fulfilledGins, totalGins),
      };
    }

    default:
      return {};
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("SUPERVISOR");
    await requireRouteAccess("reports");
    const body = generateReportSchema.parse(await request.json());
    const audit = getRequestAuditContext(request);

    resolveWarehouseFilter(user, body.warehouseId);

    const metadata = {
      ...(body.metadata ?? {}),
      ...(await buildReportMetadata(body.type, body.warehouseId, body.fromDate, body.toDate)),
    };

    const report = await prisma.report.create({
      data: {
        reportNo: generateDocumentNumber("RPT"),
        type: body.type,
        titleEn: body.titleEn,
        titleSi: body.titleSi,
        warehouseId: body.warehouseId,
        fromDate: body.fromDate,
        toDate: body.toDate,
        generatedById: user.id,
        metadata,
      },
      include: {
        warehouse: { select: { id: true, code: true, nameEn: true } },
        generatedBy: { select: { id: true, fullNameEn: true } },
      },
    });

    await writeModuleAudit({
      userId: user.id,
      action: "CREATE",
      module: "Report",
      details: { entityId: report.id, reportNo: report.reportNo, type: body.type },
      ...audit,
    });

    return successResponse(report, { status: 201, message: "Report generated" });
  } catch (error) {
    return handleApiError(error);
  }
}
