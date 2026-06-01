"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ReportTable } from "@/components/reports/ReportTable";
import { ExportButtons } from "@/components/reports/ExportButtons";
import { PrintWrapper } from "@/components/reports/PrintWrapper";
import { useReport } from "@/hooks/api/use-reports";
import { formatPercent } from "@/lib/utils/formatters";
import type { DataTableColumn } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MonthlyRow = {
  id: string;
  metric: string;
  value: number;
  target: number;
  variance: number;
};

export default function MonthlyReportPage() {
  const t = useTranslations("reports");
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));

  const { data, isLoading } = useReport("monthly", { year, month });

  const rows = (data?.metadata?.rows as MonthlyRow[] | undefined) ?? [];

  const columns: DataTableColumn<MonthlyRow>[] = [
    { id: "metric", header: t("metric"), cell: (r) => r.metric },
    {
      id: "value",
      header: t("actual"),
      cell: (r) => formatPercent(r.value, 1),
    },
    {
      id: "target",
      header: t("target"),
      cell: (r) => formatPercent(r.target, 1),
    },
    {
      id: "variance",
      header: t("variance"),
      cell: (r) => (
        <span className={r.variance < 0 ? "text-destructive" : "text-emerald-600"}>
          {r.variance > 0 ? "+" : ""}
          {formatPercent(r.variance, 1)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("monthly")}
        breadcrumbs={[{ label: t("title"), href: "/reports" }, { label: t("monthly") }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/reports">{t("back")}</Link>
          </Button>
        }
      />
      <div className="no-print mb-4 flex flex-wrap gap-4">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {new Date(2000, i).toLocaleString("en", { month: "long" })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[currentYear, currentYear - 1].map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ExportButtons
          data={rows as unknown as Record<string, unknown>[]}
          columns={columns.map((c) => ({
            key: c.id,
            header: String(c.header),
          }))}
          filePrefix="monthly-kpi"
        />
      </div>
      <PrintWrapper title={t("monthly")}>
        <ReportTable columns={columns} data={rows} isLoading={isLoading} />
      </PrintWrapper>
    </div>
  );
}
