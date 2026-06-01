"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/constants/query-keys";
import type { ListParams, NotificationRecord } from "@/types/entities";

export function useNotifications(params: ListParams = {}) {
  return useQuery({
    queryKey: queryKeys.notifications.list("current"),
    queryFn: () => api.getPaginated<NotificationRecord>("/notifications", params),
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount("current"),
    queryFn: () => api.get<{ count: number }>("/notifications/unread-count"),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch<NotificationRecord>(`/notifications/${id}/read`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<{ updated: number }>("/notifications/read-all"),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    },
  });
}
