"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DashboardLowStockItem } from "@/types/dashboard";
import { formatQuantity } from "@/lib/utils/formatters";
import { Link } from "@/i18n/navigation";

type LowStockAlertProps = {
  items: DashboardLowStockItem[];
};

export function LowStockAlert({ items }: LowStockAlertProps) {
  const t = useTranslations("dashboard.lowStock");

  return (
    <Card className="border-destructive/30">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <CardTitle className="text-base">{t("title")}</CardTitle>
        {items.length > 0 && (
          <Badge variant="destructive" className="ml-auto">
            {items.length}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <ScrollArea className="h-[280px]">
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.inventoryId}>
                  <Link
                    href={`/inventory?item=${item.itemId}`}
                    className="flex items-center justify-between gap-2 px-6 py-3 hover:bg-muted/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.itemCode}</p>
                      <BilingualLabel
                        en={item.nameEn}
                        si={item.nameSi}
                        primary="en"
                        className="text-xs"
                      />
                      <p className="text-xs text-muted-foreground">{item.categoryNameEn}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular-nums text-destructive">
                        {formatQuantity(item.currentStock, item.unit)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {t("reorderAt", { level: formatQuantity(item.reorderLevel, item.unit) })}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
