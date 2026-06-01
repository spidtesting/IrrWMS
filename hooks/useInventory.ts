"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/query-keys";
import type { DashboardSummary } from "@/types/dashboard";
import type { ApiSuccessResponse } from "@/types/api";

async function fetchInventorySummary(warehouseId: string): Promise<{
  lowStock: DashboardSummary["lowStock"];
  categoryDistribution: DashboardSummary["categoryDistribution"];
  kpis: Pick<
    DashboardSummary["kpis"],
    "totalSkus" | "totalStockUnits" | "totalStockValue" | "lowStockCount"
  >;
}> {
  const res = await fetch(
    `/api/v1/dashboard/summary?warehouseId=${encodeURIComponent(warehouseId)}&period=30d`,
  );

  if (!res.ok) {
    throw new Error("Failed to load inventory summary");
  }

  const json = (await res.json()) as ApiSuccessResponse<DashboardSummary>;
  const { lowStock, categoryDistribution, kpis } = json.data;

  return {
    lowStock,
    categoryDistribution,
    kpis: {
      totalSkus: kpis.totalSkus,
      totalStockUnits: kpis.totalStockUnits,
      totalStockValue: kpis.totalStockValue,
      lowStockCount: kpis.lowStockCount,
    },
  };
}

export function useInventory(warehouseId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.inventory.lowStock(warehouseId ?? "none"),
    queryFn: () => fetchInventorySummary(warehouseId!),
    enabled: !!warehouseId,
    staleTime: 60_000,
  });
}
