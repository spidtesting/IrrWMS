"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { ListParams, SupplierDetail, SupplierRef } from "@/types/entities";

const supplierKeys = {
  all: ["irrwms", "suppliers"] as const,
  lists: () => [...supplierKeys.all, "list"] as const,
  list: (filters: ListParams) => [...supplierKeys.lists(), filters] as const,
  detail: (id: string) => [...supplierKeys.all, "detail", id] as const,
};

export function useSupplierList(params: ListParams = {}) {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: () => api.getPaginated<SupplierRef>("/suppliers", params),
  });
}

export function useSupplier(id: string, enabled = true) {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => api.get<SupplierDetail>(`/suppliers/${id}`),
    enabled: enabled && !!id,
  });
}
