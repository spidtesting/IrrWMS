"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/constants/query-keys";
import type { ListParams, ReportRecord } from "@/types/entities";

export function useReportList(params: ListParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.reports.all(), "list", params],
    queryFn: () => api.getPaginated<ReportRecord>("/reports", params),
  });
}

export function useReport(type: string, params: ListParams = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.reports.detail(
      type,
      params.warehouseId ?? "all",
      `${params.fromDate ?? ""}-${params.toDate ?? ""}`,
    ),
    queryFn: () => api.get<ReportRecord>(`/reports/${type}`, params),
    enabled,
  });
}

export function useGenerateReport(type: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<ReportRecord>(`/reports/${type}/generate`, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.reports.all() });
    },
  });
}
