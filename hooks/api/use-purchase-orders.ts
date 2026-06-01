"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/constants/query-keys";
import type { ListParams, PurchaseOrderRecord } from "@/types/entities";

export function usePurchaseOrderList(params: ListParams = {}) {
  return useQuery({
    queryKey: queryKeys.orders.list(params.warehouseId ?? "all", params),
    queryFn: () => api.getPaginated<PurchaseOrderRecord>("/purchase-orders", params),
  });
}

export function usePurchaseOrder(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => api.get<PurchaseOrderRecord>(`/purchase-orders/${id}`),
    enabled: enabled && !!id,
  });
}
