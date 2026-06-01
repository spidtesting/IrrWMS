import type { KPIRecord, StockEntry } from "@prisma/client";
import { KPI_TARGETS } from "@/lib/constants/kpi-targets";

export type KpiInput = {
  inventoryAccuracy: number;
  avgEntryTime: number;
  orderFulfillmentRate: number;
  stockTurnoverRate: number;
  staffProductivity: number;
  shrinkageRate: number;
  pickingEfficiency: number;
  totalTransactions: number;
  totalErrors: number;
};

export type StockEntryMetrics = Pick<StockEntry, "entryDuration" | "status" | "type">;

export function calculateInventoryAccuracy(expectedQty: number, countedQty: number): number {
  if (expectedQty === 0) return countedQty === 0 ? 100 : 0;
  const variance = Math.abs(expectedQty - countedQty);
  return Math.max(0, 100 - (variance / expectedQty) * 100);
}

export function calculateAvgEntryTime(entries: StockEntryMetrics[]): number {
  const durations = entries
    .map((e) => e.entryDuration)
    .filter((d): d is number => d != null && d > 0);

  if (durations.length === 0) return 0;
  return durations.reduce((sum, d) => sum + d, 0) / durations.length;
}

export function calculateOrderFulfillmentRate(fulfilled: number, total: number): number {
  if (total === 0) return 100;
  return Math.min(100, (fulfilled / total) * 100);
}

export function calculateStockTurnoverRate(
  costOfGoodsIssued: number,
  averageInventoryValue: number,
): number {
  if (averageInventoryValue === 0) return 0;
  return costOfGoodsIssued / averageInventoryValue;
}

export function calculateStaffProductivity(linesProcessed: number, staffHours: number): number {
  if (staffHours === 0) return 0;
  return linesProcessed / staffHours;
}

export function calculateShrinkageRate(
  shrinkageValue: number,
  totalInventoryValue: number,
): number {
  if (totalInventoryValue === 0) return 0;
  return (shrinkageValue / totalInventoryValue) * 100;
}

export function calculatePickingEfficiency(linesPicked: number, pickingHours: number): number {
  if (pickingHours === 0) return 0;
  return linesPicked / pickingHours;
}

export function calculateErrorRate(totalErrors: number, totalTransactions: number): number {
  if (totalTransactions === 0) return 0;
  return (totalErrors / totalTransactions) * 100;
}

export function buildKpiRecord(input: KpiInput): KpiInput {
  return {
    inventoryAccuracy: roundKpi(input.inventoryAccuracy),
    avgEntryTime: roundKpi(input.avgEntryTime),
    orderFulfillmentRate: roundKpi(input.orderFulfillmentRate),
    stockTurnoverRate: roundKpi(input.stockTurnoverRate, 2),
    staffProductivity: roundKpi(input.staffProductivity),
    shrinkageRate: roundKpi(input.shrinkageRate),
    pickingEfficiency: roundKpi(input.pickingEfficiency),
    totalTransactions: Math.round(input.totalTransactions),
    totalErrors: Math.round(input.totalErrors),
  };
}

export function roundKpi(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export type KpiScorecard = {
  key: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  status: "good" | "warning" | "critical";
};

export function scoreKpiRecord(record: KPIRecord): KpiScorecard[] {
  return [
    scoreMetric("inventoryAccuracy", record.inventoryAccuracy, KPI_TARGETS.inventoryAccuracy),
    scoreMetric(
      "orderFulfillmentRate",
      record.orderFulfillmentRate,
      KPI_TARGETS.orderFulfillmentRate,
    ),
    scoreMetric("linesPickedPerHour", record.pickingEfficiency, KPI_TARGETS.linesPickedPerHour),
    scoreMetric("stockoutRate", record.shrinkageRate, KPI_TARGETS.stockoutRate, true),
  ];
}

function scoreMetric(
  key: string,
  value: number,
  target: {
    label: string;
    target: number;
    unit: string;
    warningThreshold: number;
    criticalThreshold: number;
    lowerIsBetter?: boolean;
  },
  lowerIsBetter = "lowerIsBetter" in target && target.lowerIsBetter,
): KpiScorecard {
  let status: "good" | "warning" | "critical";

  if (lowerIsBetter) {
    if (value <= target.target) status = "good";
    else if (value <= target.warningThreshold) status = "warning";
    else status = "critical";
  } else {
    if (value >= target.target) status = "good";
    else if (value >= target.warningThreshold) status = "warning";
    else status = "critical";
  }

  return {
    key,
    label: target.label,
    value,
    target: target.target,
    unit: target.unit,
    status,
  };
}

export function aggregateKpiRecords(records: KPIRecord[]): Partial<KpiInput> {
  if (records.length === 0) return {};

  const sum = records.reduce(
    (acc, r) => ({
      inventoryAccuracy: acc.inventoryAccuracy + r.inventoryAccuracy,
      avgEntryTime: acc.avgEntryTime + r.avgEntryTime,
      orderFulfillmentRate: acc.orderFulfillmentRate + r.orderFulfillmentRate,
      stockTurnoverRate: acc.stockTurnoverRate + r.stockTurnoverRate,
      staffProductivity: acc.staffProductivity + r.staffProductivity,
      shrinkageRate: acc.shrinkageRate + r.shrinkageRate,
      pickingEfficiency: acc.pickingEfficiency + r.pickingEfficiency,
      totalTransactions: acc.totalTransactions + r.totalTransactions,
      totalErrors: acc.totalErrors + r.totalErrors,
    }),
    {
      inventoryAccuracy: 0,
      avgEntryTime: 0,
      orderFulfillmentRate: 0,
      stockTurnoverRate: 0,
      staffProductivity: 0,
      shrinkageRate: 0,
      pickingEfficiency: 0,
      totalTransactions: 0,
      totalErrors: 0,
    },
  );

  const count = records.length;
  return buildKpiRecord({
    inventoryAccuracy: sum.inventoryAccuracy / count,
    avgEntryTime: sum.avgEntryTime / count,
    orderFulfillmentRate: sum.orderFulfillmentRate / count,
    stockTurnoverRate: sum.stockTurnoverRate / count,
    staffProductivity: sum.staffProductivity / count,
    shrinkageRate: sum.shrinkageRate / count,
    pickingEfficiency: sum.pickingEfficiency / count,
    totalTransactions: sum.totalTransactions,
    totalErrors: sum.totalErrors,
  });
}
