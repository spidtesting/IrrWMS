"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { DamageReportRecord, ListParams } from "@/types/entities";

const damageKeys = {
  all: ["irrwms", "damage-reports"] as const,
  list: (filters: ListParams) => [...damageKeys.all, "list", filters] as const,
};

export function useDamageReportList(params: ListParams = {}) {
  return useQuery({
    queryKey: damageKeys.list(params),
    queryFn: () => api.getPaginated<DamageReportRecord>("/damage-reports", params),
  });
}

export function useDamageReport(id: string, enabled = true) {
  return useQuery({
    queryKey: [...damageKeys.all, "detail", id],
    queryFn: () => api.get<DamageReportRecord>(`/damage-reports/${id}`),
    enabled: enabled && !!id,
  });
}
