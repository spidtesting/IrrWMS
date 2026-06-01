export const KPI_TARGETS = {
  orderFulfillmentRate: {
    label: "Order Fulfillment Rate",
    target: 98,
    unit: "%",
    warningThreshold: 95,
    criticalThreshold: 90,
  },
  pickAccuracy: {
    label: "Pick Accuracy",
    target: 99.5,
    unit: "%",
    warningThreshold: 98,
    criticalThreshold: 95,
  },
  packAccuracy: {
    label: "Pack Accuracy",
    target: 99.5,
    unit: "%",
    warningThreshold: 98,
    criticalThreshold: 95,
  },
  inventoryAccuracy: {
    label: "Inventory Accuracy",
    target: 99,
    unit: "%",
    warningThreshold: 97,
    criticalThreshold: 95,
  },
  onTimeShipmentRate: {
    label: "On-Time Shipment Rate",
    target: 97,
    unit: "%",
    warningThreshold: 94,
    criticalThreshold: 90,
  },
  receivingTurnaroundHours: {
    label: "Receiving Turnaround",
    target: 4,
    unit: "hrs",
    warningThreshold: 6,
    criticalThreshold: 8,
    lowerIsBetter: true,
  },
  orderCycleTimeHours: {
    label: "Order Cycle Time",
    target: 24,
    unit: "hrs",
    warningThreshold: 36,
    criticalThreshold: 48,
    lowerIsBetter: true,
  },
  dockToStockHours: {
    label: "Dock-to-Stock Time",
    target: 2,
    unit: "hrs",
    warningThreshold: 4,
    criticalThreshold: 6,
    lowerIsBetter: true,
  },
  linesPickedPerHour: {
    label: "Lines Picked Per Hour",
    target: 60,
    unit: "lines/hr",
    warningThreshold: 45,
    criticalThreshold: 30,
  },
  returnProcessingDays: {
    label: "Return Processing Time",
    target: 2,
    unit: "days",
    warningThreshold: 3,
    criticalThreshold: 5,
    lowerIsBetter: true,
  },
  stockoutRate: {
    label: "Stockout Rate",
    target: 1,
    unit: "%",
    warningThreshold: 2,
    criticalThreshold: 5,
    lowerIsBetter: true,
  },
  warehouseUtilization: {
    label: "Warehouse Utilization",
    target: 85,
    unit: "%",
    warningThreshold: 92,
    criticalThreshold: 97,
  },
} as const;

export type KpiKey = keyof typeof KPI_TARGETS;
export type KpiTarget = (typeof KPI_TARGETS)[KpiKey];

export function getKpiStatus(key: KpiKey, value: number): "good" | "warning" | "critical" {
  const kpi = KPI_TARGETS[key];
  const lowerIsBetter = "lowerIsBetter" in kpi && kpi.lowerIsBetter;

  if (lowerIsBetter) {
    if (value <= kpi.target) return "good";
    if (value <= kpi.warningThreshold) return "warning";
    return "critical";
  }

  if (value >= kpi.target) return "good";
  if (value >= kpi.warningThreshold) return "warning";
  return "critical";
}
