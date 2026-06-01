"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useUserSettings, useUpdateUserSettings } from "@/hooks/api/use-settings";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { setLanguage } = useLanguage();
  const { data: settings, isLoading } = useUserSettings();
  const updateSettings = useUpdateUserSettings();

  if (isLoading) return <LoadingSkeleton rows={4} columns={1} />;

  function handleToggle(
    key: "emailNotifications" | "lowStockAlerts" | "kpiAlerts",
    value: boolean,
  ) {
    updateSettings.mutate({ [key]: value }, { onSuccess: () => toast.success(t("saved")) });
  }

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />

      <div className="grid max-w-2xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("preferences")}</CardTitle>
            <CardDescription>{t("preferencesDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{t("language")}</Label>
              <Select
                value={settings?.language ?? "en"}
                onValueChange={(v: "en" | "si") => {
                  setLanguage(v);
                  updateSettings.mutate({ language: v });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="si">සිංහල</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("theme")}</Label>
              <Select
                value={settings?.theme ?? "system"}
                onValueChange={(v: "light" | "dark" | "system") =>
                  updateSettings.mutate({ theme: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t("light")}</SelectItem>
                  <SelectItem value="dark">{t("dark")}</SelectItem>
                  <SelectItem value="system">{t("system")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("notifications")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(
              [
                ["emailNotifications", t("emailNotifications")],
                ["lowStockAlerts", t("lowStockAlerts")],
                ["kpiAlerts", t("kpiAlerts")],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key}>{label}</Label>
                <Switch
                  id={key}
                  checked={settings?.[key] ?? false}
                  onCheckedChange={(v) => handleToggle(key, v)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/settings/security">{t("security")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/settings/warehouse">{t("warehouseSettings")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
