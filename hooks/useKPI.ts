"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants/query-keys";
import type { DashboardSummary } from "@/types/dashboard";
import type { ApiSuccessResponse } from "@/types/api";

async function fetchDashboardSummary(
  warehouseId: string,
  period: string,
): Promise<DashboardSummary> {
  const params = new URLSearchParams({ warehouseId, period });
  const res = await fetch(`/api/v1/dashboard/summary?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to load dashboard summary");
  }

  const json = (await res.json()) as ApiSuccessResponse<DashboardSummary>;
  return json.data;
}

export function useKPI(warehouseId: string | null | undefined, period = "30d") {
  return useQuery({
    queryKey: queryKeys.dashboard.kpis(warehouseId ?? "none", period),
    queryFn: () => fetchDashboardSummary(warehouseId!, period),
    enabled: !!warehouseId,
    staleTime: 60_000,
  });
}
