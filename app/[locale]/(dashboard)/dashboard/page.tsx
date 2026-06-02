"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Boxes, PackagePlus, PackageMinus, AlertTriangle, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useLowStockItems } from "@/hooks/api/use-inventory";
import { usePendingStockEntries } from "@/hooks/api/use-stock-entry";
import { useUnreadNotificationCount } from "@/hooks/api/use-notifications";
import { useKPISummary } from "@/hooks/api/use-kpi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils/formatters";

const quickLinks = [
  { href: "/inventory", icon: Boxes, labelKey: "inventory" },
  { href: "/goods-received/new", icon: PackagePlus, labelKey: "receiveGoods" },
  { href: "/goods-issued/new", icon: PackageMinus, labelKey: "issueGoods" },
  { href: "/kpi", icon: BarChart3, labelKey: "viewKpi" },
] as const;

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: lowStock } = useLowStockItems();
  const { data: pendingEntries } = usePendingStockEntries({ limit: 5 });
  const { data: unread } = useUnreadNotificationCount();
  const { data: kpi } = useKPISummary();

  return (
    <div>
      <PageHeader title={t("title")} description={t("welcome")} />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("lowStockItems")}</CardDescription>
            <CardTitle className="text-3xl text-amber-600">{lowStock?.length ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("pendingApprovals")}</CardDescription>
            <CardTitle className="text-3xl text-primary">
              {pendingEntries?.meta?.total ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("notifications")}</CardDescription>
            <CardTitle className="text-3xl">{unread?.count ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("inventoryAccuracy")}</CardDescription>
            <CardTitle className="text-3xl text-emerald-600">
              {kpi ? formatPercent(kpi.inventoryAccuracy, 1) : "—"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-medium">{t(link.labelKey)}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {(lowStock?.length ?? 0) > 0 && (
        <Card className="mt-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-5 w-5" />
              {t("lowStockAlert")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {lowStock?.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/inventory/${item.itemId}`}
                    className="underline-offset-4 hover:text-primary hover:underline"
                  >
                    {item.item.nameEn} — {item.currentStock} {item.item.unit}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
