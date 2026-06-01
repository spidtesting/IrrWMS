import { EntryStatus, TransactionType } from "@prisma/client";
import { subDays, format, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import type { DashboardSummary } from "@/types/dashboard";

const INBOUND_TYPES: TransactionType[] = [
  TransactionType.GOODS_RECEIVED,
  TransactionType.TRANSFER_IN,
  TransactionType.GOODS_RETURNED,
];

const OUTBOUND_TYPES: TransactionType[] = [
  TransactionType.GOODS_ISSUED,
  TransactionType.TRANSFER_OUT,
  TransactionType.DAMAGED,
  TransactionType.EXPIRED,
];

export async function getDashboardSummary(
  warehouseId: string,
  period = "30d",
): Promise<DashboardSummary> {
  const warehouse = await prisma.warehouse.findUniqueOrThrow({
    where: { id: warehouseId },
    select: { id: true, nameEn: true, nameSi: true },
  });

  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
  const rangeStart = startOfDay(subDays(new Date(), days - 1));

  const [latestKpi, totalSkus, inventories, pendingEntries, stockEntries, recentEntries] =
    await Promise.all([
      prisma.kPIRecord.findFirst({
        where: { warehouseId },
        orderBy: [{ year: "desc" }, { month: "desc" }],
      }),
      prisma.item.count({
        where: { warehouseId, isActive: true, deletedAt: null },
      }),
      prisma.inventory.findMany({
        where: { warehouseId, item: { isActive: true, deletedAt: null } },
        include: {
          item: {
            include: { category: true },
          },
        },
      }),
      prisma.stockEntry.count({
        where: { warehouseId, status: EntryStatus.PENDING },
      }),
      prisma.stockEntry.findMany({
        where: {
          warehouseId,
          status: EntryStatus.APPROVED,
          createdAt: { gte: rangeStart },
        },
        select: {
          type: true,
          quantity: true,
          createdAt: true,
        },
      }),
      prisma.stockEntry.findMany({
        where: { warehouseId },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          item: {
            select: {
              itemCode: true,
              nameEn: true,
              nameSi: true,
            },
          },
          createdBy: {
            select: { fullNameEn: true, fullNameSi: true },
          },
        },
      }),
    ]);

  let totalStockUnits = 0;
  let totalStockValue = 0;
  const categoryMap = new Map<
    string,
    {
      categoryId: string;
      code: string;
      nameEn: string;
      nameSi: string;
      quantity: number;
      value: number;
    }
  >();

  const allLowStock = inventories.filter((inv) => inv.currentStock <= inv.item.reorderLevel);

  const lowStock = [...allLowStock]
    .sort((a, b) => a.currentStock - b.currentStock)
    .slice(0, 10)
    .map((inv) => ({
      inventoryId: inv.id,
      itemId: inv.itemId,
      itemCode: inv.item.itemCode,
      nameEn: inv.item.nameEn,
      nameSi: inv.item.nameSi,
      currentStock: inv.currentStock,
      reorderLevel: inv.item.reorderLevel,
      unit: inv.item.unit,
      categoryNameEn: inv.item.category.nameEn,
      categoryNameSi: inv.item.category.nameSi,
    }));

  for (const inv of inventories) {
    const unitPrice = Number(inv.item.unitPrice);
    totalStockUnits += inv.currentStock;
    totalStockValue += inv.currentStock * unitPrice;

    const cat = inv.item.category;
    const existing = categoryMap.get(cat.id) ?? {
      categoryId: cat.id,
      code: cat.code,
      nameEn: cat.nameEn,
      nameSi: cat.nameSi,
      quantity: 0,
      value: 0,
    };
    existing.quantity += inv.currentStock;
    existing.value += inv.currentStock * unitPrice;
    categoryMap.set(cat.id, existing);
  }

  const movementMap = new Map<string, { inbound: number; outbound: number }>();
  for (let i = 0; i < days; i++) {
    const d = format(startOfDay(subDays(new Date(), days - 1 - i)), "yyyy-MM-dd");
    movementMap.set(d, { inbound: 0, outbound: 0 });
  }

  for (const entry of stockEntries) {
    const key = format(startOfDay(entry.createdAt), "yyyy-MM-dd");
    const bucket = movementMap.get(key);
    if (!bucket) continue;

    if (INBOUND_TYPES.includes(entry.type)) {
      bucket.inbound += entry.quantity;
    } else if (OUTBOUND_TYPES.includes(entry.type)) {
      bucket.outbound += entry.quantity;
    }
  }

  const stockMovement = Array.from(movementMap.entries()).map(([date, values]) => ({
    date,
    inbound: values.inbound,
    outbound: values.outbound,
  }));

  return {
    warehouseId: warehouse.id,
    warehouseNameEn: warehouse.nameEn,
    warehouseNameSi: warehouse.nameSi,
    period,
    kpis: {
      totalSkus,
      totalStockUnits,
      totalStockValue,
      lowStockCount: allLowStock.length,
      pendingEntries,
      inventoryAccuracy: latestKpi?.inventoryAccuracy ?? 0,
      orderFulfillmentRate: latestKpi?.orderFulfillmentRate ?? 0,
      avgEntryTime: latestKpi?.avgEntryTime ?? 0,
      stockTurnoverRate: latestKpi?.stockTurnoverRate ?? 0,
      staffProductivity: latestKpi?.staffProductivity ?? 0,
      pickingEfficiency: latestKpi?.pickingEfficiency ?? 0,
      shrinkageRate: latestKpi?.shrinkageRate ?? 0,
    },
    stockMovement,
    categoryDistribution: Array.from(categoryMap.values()).sort((a, b) => b.value - a.value),
    recentEntries: recentEntries.map((entry) => ({
      id: entry.id,
      entryNumber: entry.entryNumber,
      type: entry.type,
      status: entry.status,
      quantity: entry.quantity,
      createdAt: entry.createdAt.toISOString(),
      itemCode: entry.item.itemCode,
      itemNameEn: entry.item.nameEn,
      itemNameSi: entry.item.nameSi,
      createdByEn: entry.createdBy.fullNameEn,
      createdBySi: entry.createdBy.fullNameSi,
    })),
    lowStock,
  };
}
