"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/constants/query-keys";
import type { ListParams, TaskRecord, UserRef } from "@/types/entities";

export function useStaffList(params: ListParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => api.getPaginated<UserRef>("/staff", params),
  });
}

export function useStaffMember(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => api.get<UserRef>(`/staff/${id}`),
    enabled: enabled && !!id,
  });
}

export function useTaskList(params: ListParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.all, "tasks", "list", params],
    queryFn: () => api.getPaginated<TaskRecord>("/staff/tasks", params),
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; status: string }) =>
      api.patch<TaskRecord>(`/staff/tasks/${data.id}`, {
        status: data.status,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...queryKeys.all, "tasks"] });
    },
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post<TaskRecord>("/staff/tasks", data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [...queryKeys.all, "tasks"] });
    },
  });
}
