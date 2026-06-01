"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KPIChart } from "@/components/kpi/KPIChart";
import { KPIProgressBar } from "@/components/kpi/ProgressBar";
import { KPIHistory } from "@/components/kpi/KPIHistory";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useKPIRecords, useKPISummary, useKPIHistory } from "@/hooks/api/use-kpi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KPIPage() {
  const t = useTranslations("kpi");
  const { data: summary, isLoading: summaryLoading } = useKPISummary();
  const { data: history, isLoading: historyLoading } = useKPIHistory(
    summary?.warehouseId ?? "",
    12,
  );
  const { data: records } = useKPIRecords();

  const chartData =
    history?.map((r) => ({
      label: `${r.year}-${String(r.month).padStart(2, "0")}`,
      inventoryAccuracy: r.inventoryAccuracy,
      orderFulfillmentRate: r.orderFulfillmentRate,
      stockTurnoverRate: r.stockTurnoverRate,
      staffProductivity: r.staffProductivity,
    })) ?? [];

  if (summaryLoading) return <LoadingSkeleton rows={8} columns={3} />;

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />

      {summary && (
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {t("inventoryAccuracy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <KPIProgressBar label="" value={summary.inventoryAccuracy} target={95} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t("fulfillment")}</CardTitle>
            </CardHeader>
            <CardContent>
              <KPIProgressBar label="" value={summary.orderFulfillmentRate} target={90} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {t("staffProductivity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <KPIProgressBar label="" value={summary.staffProductivity} target={85} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{t("transactions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{summary.totalTransactions}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("trends")}</CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <LoadingSkeleton rows={4} columns={1} />
          ) : (
            <KPIChart data={chartData} />
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold">{t("history")}</h2>
        {historyLoading ? (
          <LoadingSkeleton rows={3} columns={3} />
        ) : (
          <KPIHistory records={history ?? records ?? []} />
        )}
      </div>
    </div>
  );
}
