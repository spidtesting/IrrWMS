import type { EntryStatus, TransactionType } from "@prisma/client";

export type DashboardKpiSummary = {
  totalSkus: number;
  totalStockUnits: number;
  totalStockValue: number;
  lowStockCount: number;
  pendingEntries: number;
  inventoryAccuracy: number;
  orderFulfillmentRate: number;
  avgEntryTime: number;
  stockTurnoverRate: number;
  staffProductivity: number;
  pickingEfficiency: number;
  shrinkageRate: number;
};

export type StockMovementPoint = {
  date: string;
  inbound: number;
  outbound: number;
};

export type CategoryDistributionPoint = {
  categoryId: string;
  code: string;
  nameEn: string;
  nameSi: string;
  quantity: number;
  value: number;
};

export type DashboardRecentEntry = {
  id: string;
  entryNumber: string;
  type: TransactionType;
  status: EntryStatus;
  quantity: number;
  createdAt: string;
  itemCode: string;
  itemNameEn: string;
  itemNameSi: string;
  createdByEn: string;
  createdBySi: string;
};

export type DashboardLowStockItem = {
  inventoryId: string;
  itemId: string;
  itemCode: string;
  nameEn: string;
  nameSi: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  categoryNameEn: string;
  categoryNameSi: string;
};

export type DashboardSummary = {
  warehouseId: string;
  warehouseNameEn: string;
  warehouseNameSi: string;
  period: string;
  kpis: DashboardKpiSummary;
  stockMovement: StockMovementPoint[];
  categoryDistribution: CategoryDistributionPoint[];
  recentEntries: DashboardRecentEntry[];
  lowStock: DashboardLowStockItem[];
};
