"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/constants/query-keys";
import type { AuditLogRecord, ListParams } from "@/types/entities";

export function useAuditLogList(params: ListParams = {}) {
  return useQuery({
    queryKey: queryKeys.auditLogs.list(params),
    queryFn: () => api.getPaginated<AuditLogRecord>("/audit-logs", params),
  });
}
