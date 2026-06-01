"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/constants/query-keys";
import type { KPIRecordData } from "@/types/entities";

export function useKPIRecords(
  params: {
    warehouseId?: string;
    year?: number;
    month?: number;
  } = {},
) {
  return useQuery({
    queryKey: queryKeys.dashboard.kpis(
      params.warehouseId ?? "all",
      `${params.year ?? "all"}-${params.month ?? "all"}`,
    ),
    queryFn: () => api.get<KPIRecordData[]>("/kpi", params),
  });
}

export function useKPIHistory(warehouseId: string, months = 12) {
  return useQuery({
    queryKey: [...queryKeys.dashboard.all(), "history", warehouseId, months],
    queryFn: () => api.get<KPIRecordData[]>("/kpi/history", { warehouseId, months }),
    enabled: !!warehouseId,
  });
}

export function useKPISummary(warehouseId?: string) {
  return useQuery({
    queryKey: [...queryKeys.dashboard.all(), "summary", warehouseId ?? "all"],
    queryFn: () => api.get<KPIRecordData>("/kpi/summary", { warehouseId }),
  });
}
