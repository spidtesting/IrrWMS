"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useWarehouseSettings, useUpdateWarehouseSettings } from "@/hooks/api/use-settings";
import { useWarehouseList } from "@/hooks/api/use-warehouse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WarehouseSettingsPage() {
  const t = useTranslations("settings");
  const { data: whSettings, isLoading } = useWarehouseSettings();
  const { data: warehouses } = useWarehouseList({ limit: 100 });
  const updateSettings = useUpdateWarehouseSettings();

  if (isLoading) return <LoadingSkeleton rows={3} columns={1} />;

  return (
    <div>
      <PageHeader
        title={t("warehouseSettings")}
        breadcrumbs={[{ label: t("title"), href: "/settings" }, { label: t("warehouseSettings") }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/settings">{t("back")}</Link>
          </Button>
        }
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{t("warehouseConfig")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>{t("defaultWarehouse")}</Label>
            <Select
              value={whSettings?.defaultWarehouseId ?? ""}
              onValueChange={(v) =>
                updateSettings.mutate(
                  { defaultWarehouseId: v },
                  { onSuccess: () => toast.success(t("saved")) },
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectWarehouse")} />
              </SelectTrigger>
              <SelectContent>
                {warehouses?.data?.map((wh) => (
                  <SelectItem key={wh.id} value={wh.id}>
                    {wh.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("autoApproveThreshold")}</Label>
            <Input
              type="number"
              defaultValue={whSettings?.autoApproveThreshold ?? 0}
              onBlur={(e) =>
                updateSettings.mutate({
                  autoApproveThreshold: parseFloat(e.target.value) || 0,
                })
              }
            />
            <p className="text-xs text-muted-foreground">{t("autoApproveHint")}</p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="low-stock-notif">{t("lowStockNotification")}</Label>
            <Switch
              id="low-stock-notif"
              checked={whSettings?.lowStockNotification ?? true}
              onCheckedChange={(v) => updateSettings.mutate({ lowStockNotification: v })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
