"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ReportTable } from "@/components/reports/ReportTable";
import { ExportButtons } from "@/components/reports/ExportButtons";
import { PrintWrapper } from "@/components/reports/PrintWrapper";
import { useReport } from "@/hooks/api/use-reports";
import { formatCurrency, formatQuantity } from "@/lib/utils/formatters";
import type { DataTableColumn } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AnnualRow = {
  id: string;
  category: string;
  itemCount: number;
  totalQuantity: number;
  totalValue: number;
};

export default function AnnualReportPage() {
  const t = useTranslations("reports");
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));

  const { data, isLoading } = useReport("annual", { year });

  const rows = (data?.metadata?.rows as AnnualRow[] | undefined) ?? [];

  const columns: DataTableColumn<AnnualRow>[] = [
    { id: "category", header: t("category"), cell: (r) => r.category },
    { id: "items", header: t("itemCount"), cell: (r) => r.itemCount },
    {
      id: "quantity",
      header: t("totalQuantity"),
      cell: (r) => formatQuantity(r.totalQuantity),
    },
    {
      id: "value",
      header: t("totalValue"),
      cell: (r) => formatCurrency(r.totalValue),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("annual")}
        breadcrumbs={[{ label: t("title"), href: "/reports" }, { label: t("annual") }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/reports">{t("back")}</Link>
          </Button>
        }
      />
      <div className="no-print mb-4 flex flex-wrap gap-4">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
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
          filePrefix="annual-inventory"
        />
      </div>
      <PrintWrapper title={`${t("annual")} ${year}`}>
        <ReportTable columns={columns} data={rows} isLoading={isLoading} />
      </PrintWrapper>
    </div>
  );
}
