"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { usePhysicalCountList } from "@/hooks/api/use-physical-count";
import { formatDate } from "@/lib/utils/formatters";
import type { PhysicalCountRecord } from "@/types/entities";

export default function PhysicalCountPage() {
  const t = useTranslations("physicalCount");
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePhysicalCountList({ page, limit: 20 });

  const columns: DataTableColumn<PhysicalCountRecord>[] = [
    {
      id: "cycleNo",
      header: t("cycleNo"),
      cell: (r) => <span className="font-mono">{r.cycleNo}</span>,
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
      id: "conductedBy",
      header: t("conductedBy"),
      cell: (r) => r.conductedBy.fullNameEn,
    },
    {
      id: "started",
      header: t("startedAt"),
      cell: (r) => formatDate(r.startedAt),
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
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          getRowKey={(r) => r.id}
          onRowClick={(r) => router.push(`/physical-count/${r.id}`)}
        />
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
