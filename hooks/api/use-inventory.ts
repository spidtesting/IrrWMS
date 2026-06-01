"use client";

import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/constants/query-keys";
import type { InventoryRecord, ItemDetail, ListParams } from "@/types/entities";
import type { PaginatedResponse } from "@/types/api";

export function useInventoryList(
  params: ListParams = {},
  options?: Partial<UseQueryOptions<PaginatedResponse<InventoryRecord>>>,
) {
  return useQuery({
    queryKey: queryKeys.inventory.list(params.warehouseId ?? "all", params),
    queryFn: () => api.getPaginated<InventoryRecord>("/inventory", params),
    ...options,
  });
}

export function useInventoryItem(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => api.get<ItemDetail>(`/inventory/items/${id}`),
    enabled: enabled && !!id,
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post<ItemDetail>("/inventory/items", data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.inventory.all() });
    },
  });
}

export function useUpdateItem(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.patch<ItemDetail>(`/inventory/items/${id}`, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
      void qc.invalidateQueries({ queryKey: queryKeys.inventory.all() });
    },
  });
}

export function useAdjustInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post<InventoryRecord>("/inventory/adjust", data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.inventory.all() });
    },
  });
}

export function useLowStockItems(warehouseId?: string) {
  return useQuery({
    queryKey: queryKeys.inventory.lowStock(warehouseId ?? "all"),
    queryFn: () => api.get<InventoryRecord[]>("/inventory/low-stock", { warehouseId }),
  });
}
