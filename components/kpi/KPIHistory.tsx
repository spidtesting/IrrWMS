"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatPercent } from "@/lib/utils/formatters";
import type { KPIRecordData } from "@/types/entities";

export type KPIHistoryProps = {
  records: KPIRecordData[];
};

export function KPIHistory({ records }: KPIHistoryProps) {
  const t = useTranslations("kpi");

  if (records.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">{t("noHistory")}</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {records.map((record) => (
        <Card key={record.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {formatDate(record.recordDate, "MMM yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("inventoryAccuracy")}</span>
              <span className="font-mono">{formatPercent(record.inventoryAccuracy, 1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("fulfillment")}</span>
              <span className="font-mono">{formatPercent(record.orderFulfillmentRate, 1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("transactions")}</span>
              <span className="font-mono">{record.totalTransactions}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
