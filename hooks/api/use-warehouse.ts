"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/constants/query-keys";
import type { ListParams, WarehouseDetail, WarehouseRef } from "@/types/entities";

export function useWarehouseList(params: ListParams = {}) {
  return useQuery({
    queryKey: queryKeys.warehouses.list(params),
    queryFn: () => api.getPaginated<WarehouseRef>("/warehouse", params),
  });
}

export function useWarehouse(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.warehouses.detail(id),
    queryFn: () => api.get<WarehouseDetail>(`/warehouse/${id}`),
    enabled: enabled && !!id,
  });
}

export function useWarehouseStats(id: string) {
  return useQuery({
    queryKey: queryKeys.warehouses.stats(id),
    queryFn: () => api.get<WarehouseDetail["stats"]>(`/warehouse/${id}/stats`),
    enabled: !!id,
  });
}
