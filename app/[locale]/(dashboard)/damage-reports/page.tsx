"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useDamageReportList } from "@/hooks/api/use-damage-reports";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import type { DamageReportRecord } from "@/types/entities";

export default function DamageReportsPage() {
  const t = useTranslations("damageReports");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useDamageReportList({ page, limit: 20 });

  const columns: DataTableColumn<DamageReportRecord>[] = [
    {
      id: "reportNo",
      header: t("reportNo"),
      cell: (r) => <span className="font-mono">{r.reportNo}</span>,
    },
    {
      id: "warehouse",
      header: t("warehouse"),
      cell: (r) => r.warehouse.nameEn,
    },
    {
      id: "status",
      header: t("status"),
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      id: "incident",
      header: t("incidentDate"),
      cell: (r) => formatDate(r.incidentDate),
    },
    {
      id: "cost",
      header: t("totalCost"),
      cell: (r) => formatCurrency(Number(r.totalCost)),
    },
    {
      id: "lines",
      header: t("items"),
      cell: (r) => r.lines.length,
    },
  ];

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
      {isLoading ? (
        <LoadingSkeleton rows={6} columns={6} />
      ) : (
        <DataTable columns={columns} data={data?.data ?? []} getRowKey={(r) => r.id} />
      )}
      {data?.meta && (
        <PaginationControls
          className="mt-4"
          page={data.meta.page}
          pageSize={data.meta.limit}
          totalItems={data.meta.total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
