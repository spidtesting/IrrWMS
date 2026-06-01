"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ParetoChart } from "@/components/reports/ParetoChart";
import { ReportTable } from "@/components/reports/ReportTable";
import { ExportButtons } from "@/components/reports/ExportButtons";
import { useReport } from "@/hooks/api/use-reports";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";
import type { DataTableColumn } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ParetoItem } from "@/lib/utils/pareto";

type ParetoRow = ParetoItem & {
  cumulativePercent: number;
  rank: number;
};

export default function ParetoReportPage() {
  const t = useTranslations("reports");
  const { data, isLoading } = useReport("pareto", {});

  const items = (data?.metadata?.items as ParetoItem[] | undefined) ?? [];
  const rows = (data?.metadata?.rows as ParetoRow[] | undefined) ?? [];

  const columns: DataTableColumn<ParetoRow>[] = [
    { id: "rank", header: t("rank"), cell: (r) => r.rank },
    { id: "label", header: t("itemName"), cell: (r) => r.label },
    {
      id: "value",
      header: t("value"),
      cell: (r) => formatCurrency(r.value),
    },
    {
      id: "cumulative",
      header: t("cumulative"),
      cell: (r) => formatPercent(r.cumulativePercent, 1),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("pareto")}
        breadcrumbs={[{ label: t("title"), href: "/reports" }, { label: t("pareto") }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/reports">{t("back")}</Link>
          </Button>
        }
      />
      <div className="no-print mb-4">
        <ExportButtons
          data={rows as unknown as Record<string, unknown>[]}
          columns={columns.map((c) => ({
            key: c.id,
            header: String(c.header),
          }))}
          filePrefix="pareto-analysis"
        />
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("paretoChart")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ParetoChart items={items} />
        </CardContent>
      </Card>
      <ReportTable columns={columns} data={rows} isLoading={isLoading} />
    </div>
  );
}
