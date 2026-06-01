"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { GINRecord, ListParams } from "@/types/entities";

const ginKeys = {
  all: ["irrwms", "gin"] as const,
  lists: () => [...ginKeys.all, "list"] as const,
  list: (filters: ListParams) => [...ginKeys.lists(), filters] as const,
  detail: (id: string) => [...ginKeys.all, "detail", id] as const,
};

export function useGINList(params: ListParams = {}) {
  return useQuery({
    queryKey: ginKeys.list(params),
    queryFn: () => api.getPaginated<GINRecord>("/goods-issued", params),
  });
}

export function useGIN(id: string, enabled = true) {
  return useQuery({
    queryKey: ginKeys.detail(id),
    queryFn: () => api.get<GINRecord>(`/goods-issued/${id}`),
    enabled: enabled && !!id,
  });
}

export function useCreateGIN() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post<GINRecord>("/goods-issued", data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ginKeys.all });
    },
  });
}

export function useUpdateGINStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { status: string; remarks?: string }) =>
      api.patch<GINRecord>(`/goods-issued/${id}/status`, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ginKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: ginKeys.all });
    },
  });
}
