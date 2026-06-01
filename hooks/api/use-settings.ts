"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export type UserSettings = {
  language: "en" | "si";
  emailNotifications: boolean;
  lowStockAlerts: boolean;
  kpiAlerts: boolean;
  theme: "light" | "dark" | "system";
};

export type SecuritySettings = {
  twoFactorEnabled: boolean;
  lastPasswordChange?: string | null;
  activeSessions: number;
};

export type WarehouseSettings = {
  defaultWarehouseId?: string | null;
  autoApproveThreshold?: number;
  lowStockNotification: boolean;
};

export function useUserSettings() {
  return useQuery({
    queryKey: ["irrwms", "settings", "user"],
    queryFn: () => api.get<UserSettings>("/settings"),
  });
}

export function useUpdateUserSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserSettings>) => api.patch<UserSettings>("/settings", data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["irrwms", "settings"] });
    },
  });
}

export function useSecuritySettings() {
  return useQuery({
    queryKey: ["irrwms", "settings", "security"],
    queryFn: () => api.get<SecuritySettings>("/settings/security"),
  });
}

export function useWarehouseSettings() {
  return useQuery({
    queryKey: ["irrwms", "settings", "warehouse"],
    queryFn: () => api.get<WarehouseSettings>("/settings/warehouse"),
  });
}

export function useUpdateWarehouseSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<WarehouseSettings>) =>
      api.patch<WarehouseSettings>("/settings/warehouse", data),
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["irrwms", "settings", "warehouse"],
      });
    },
  });
}

export function useUploadSignature() {
  return useMutation({
    mutationFn: (data: { folder?: string; publicId?: string }) =>
      api.post<{ signature: string; timestamp: number; cloudName: string; apiKey: string }>(
        "/upload/signature",
        data,
      ),
  });
}
