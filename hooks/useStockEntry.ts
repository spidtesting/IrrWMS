"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/query-keys";
import type { DashboardSummary } from "@/types/dashboard";
import type { ApiSuccessResponse } from "@/types/api";

async function fetchRecentEntries(warehouseId: string): Promise<{
  recentEntries: DashboardSummary["recentEntries"];
  stockMovement: DashboardSummary["stockMovement"];
  pendingEntries: number;
}> {
  const res = await fetch(
    `/api/v1/dashboard/summary?warehouseId=${encodeURIComponent(warehouseId)}&period=30d`,
  );

  if (!res.ok) {
    throw new Error("Failed to load stock entries");
  }

  const json = (await res.json()) as ApiSuccessResponse<DashboardSummary>;
  const { recentEntries, stockMovement, kpis } = json.data;

  return {
    recentEntries,
    stockMovement,
    pendingEntries: kpis.pendingEntries,
  };
}

export function useStockEntry(warehouseId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.dashboard.activity(warehouseId ?? "none"),
    queryFn: () => fetchRecentEntries(warehouseId!),
    enabled: !!warehouseId,
    staleTime: 30_000,
  });
}
