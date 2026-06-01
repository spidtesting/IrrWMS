"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { GRNRecord, ListParams } from "@/types/entities";

const grnKeys = {
  all: ["irrwms", "grn"] as const,
  lists: () => [...grnKeys.all, "list"] as const,
  list: (filters: ListParams) => [...grnKeys.lists(), filters] as const,
  detail: (id: string) => [...grnKeys.all, "detail", id] as const,
};

export function useGRNList(params: ListParams = {}) {
  return useQuery({
    queryKey: grnKeys.list(params),
    queryFn: () => api.getPaginated<GRNRecord>("/goods-received", params),
  });
}

export function useGRN(id: string, enabled = true) {
  return useQuery({
    queryKey: grnKeys.detail(id),
    queryFn: () => api.get<GRNRecord>(`/goods-received/${id}`),
    enabled: enabled && !!id,
  });
}

export function useCreateGRN() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post<GRNRecord>("/goods-received", data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: grnKeys.all });
    },
  });
}

export function useUpdateGRNStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { status: string; remarks?: string }) =>
      api.patch<GRNRecord>(`/goods-received/${id}/status`, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: grnKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: grnKeys.all });
    },
  });
}
