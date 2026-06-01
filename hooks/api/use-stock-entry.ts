"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { ListParams, StockEntryRecord } from "@/types/entities";

const stockEntryKeys = {
  all: ["irrwms", "stock-entry"] as const,
  lists: () => [...stockEntryKeys.all, "list"] as const,
  list: (filters: ListParams) => [...stockEntryKeys.lists(), filters] as const,
  detail: (id: string) => [...stockEntryKeys.all, "detail", id] as const,
  pending: () => [...stockEntryKeys.all, "pending"] as const,
};

export function useStockEntryList(params: ListParams = {}) {
  return useQuery({
    queryKey: stockEntryKeys.list(params),
    queryFn: () => api.getPaginated<StockEntryRecord>("/stock-entry", params),
  });
}

export function usePendingStockEntries(params: ListParams = {}) {
  return useQuery({
    queryKey: stockEntryKeys.pending(),
    queryFn: () =>
      api.getPaginated<StockEntryRecord>("/stock-entry", {
        ...params,
        status: "PENDING",
      }),
  });
}

export function useStockEntry(id: string, enabled = true) {
  return useQuery({
    queryKey: stockEntryKeys.detail(id),
    queryFn: () => api.get<StockEntryRecord>(`/stock-entry/${id}`),
    enabled: enabled && !!id,
  });
}

export function useCreateStockEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post<StockEntryRecord>("/stock-entry", data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: stockEntryKeys.all });
    },
  });
}

export function useApproveStockEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { ids: string[]; action: "APPROVED" | "REJECTED" }) =>
      api.post<{ updated: number }>("/stock-entry/approve", data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: stockEntryKeys.all });
    },
  });
}
