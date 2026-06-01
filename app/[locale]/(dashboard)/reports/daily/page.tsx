"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ReportTable } from "@/components/reports/ReportTable";
import { ExportButtons } from "@/components/reports/ExportButtons";
import { PrintWrapper } from "@/components/reports/PrintWrapper";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { useReport } from "@/hooks/api/use-reports";
import { formatDate, formatQuantity } from "@/lib/utils/formatters";
import type { DataTableColumn } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";

type DailyRow = {
  id: string;
  itemCode: string;
  itemName: string;
  openingStock: number;
  received: number;
  issued: number;
  closingStock: number;
  unit: string;
};

export default function DailyReportPage() {
  const t = useTranslations("reports");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(),
    to: new Date(),
  });

  const { data, isLoading } = useReport(
    "daily",
    {
      fromDate: dateRange.from?.toISOString(),
      toDate: dateRange.to?.toISOString(),
    },
    !!dateRange.from && !!dateRange.to,
  );

  const rows = (data?.metadata?.rows as DailyRow[] | undefined) ?? [];

  const columns: DataTableColumn<DailyRow>[] = [
    { id: "code", header: t("itemCode"), cell: (r) => r.itemCode },
    { id: "name", header: t("itemName"), cell: (r) => r.itemName },
    {
      id: "opening",
      header: t("openingStock"),
      cell: (r) => formatQuantity(r.openingStock, r.unit),
    },
    {
      id: "received",
      header: t("received"),
      cell: (r) => formatQuantity(r.received, r.unit),
    },
    {
      id: "issued",
      header: t("issued"),
      cell: (r) => formatQuantity(r.issued, r.unit),
    },
    {
      id: "closing",
      header: t("closingStock"),
      cell: (r) => formatQuantity(r.closingStock, r.unit),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("daily")}
        breadcrumbs={[{ label: t("title"), href: "/reports" }, { label: t("daily") }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/reports">{t("back")}</Link>
          </Button>
        }
      />
      <div className="no-print mb-4 flex flex-wrap items-end gap-4">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <ExportButtons
          data={rows as unknown as Record<string, unknown>[]}
          columns={columns.map((c) => ({
            key: c.id,
            header: String(c.header),
          }))}
          filePrefix="daily-stock"
        />
      </div>
      <PrintWrapper title={`${t("daily")} — ${formatDate(dateRange.from)}`}>
        <ReportTable columns={columns} data={rows} isLoading={isLoading} />
      </PrintWrapper>
    </div>
  );
}
