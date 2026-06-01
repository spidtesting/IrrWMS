"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { ListParams, PhysicalCountRecord } from "@/types/entities";

const countKeys = {
  all: ["irrwms", "physical-count"] as const,
  lists: () => [...countKeys.all, "list"] as const,
  list: (filters: ListParams) => [...countKeys.lists(), filters] as const,
  detail: (id: string) => [...countKeys.all, "detail", id] as const,
};

export function usePhysicalCountList(params: ListParams = {}) {
  return useQuery({
    queryKey: countKeys.list(params),
    queryFn: () => api.getPaginated<PhysicalCountRecord>("/physical-count", params),
  });
}

export function usePhysicalCount(id: string, enabled = true) {
  return useQuery({
    queryKey: countKeys.detail(id),
    queryFn: () => api.get<PhysicalCountRecord>(`/physical-count/${id}`),
    enabled: enabled && !!id,
  });
}

export function useCreatePhysicalCount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<PhysicalCountRecord>("/physical-count", data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: countKeys.all });
    },
  });
}

export function useUpdateCountLines(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.patch<PhysicalCountRecord>(`/physical-count/${id}/lines`, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: countKeys.detail(id) });
    },
  });
}

export function useCompletePhysicalCount(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<PhysicalCountRecord>(`/physical-count/${id}/complete`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: countKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: countKeys.all });
    },
  });
}
