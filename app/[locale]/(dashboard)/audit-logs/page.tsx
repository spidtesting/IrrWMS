"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useAuditLogList } from "@/hooks/api/use-audit-logs";
import { formatDateTime } from "@/lib/utils/formatters";
import type { AuditLogRecord } from "@/types/entities";

export default function AuditLogsPage() {
  const t = useTranslations("auditLogs");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAuditLogList({ page, limit: 30 });

  const columns: DataTableColumn<AuditLogRecord>[] = [
    {
      id: "time",
      header: t("timestamp"),
      cell: (r) => formatDateTime(r.createdAt),
    },
    {
      id: "user",
      header: t("user"),
      cell: (r) => r.user.fullNameEn,
    },
    {
      id: "module",
      header: t("module"),
      cell: (r) => r.module,
    },
    {
      id: "action",
      header: t("action"),
      cell: (r) => r.action,
    },
    {
      id: "ip",
      header: t("ipAddress"),
      cell: (r) => r.ipAddress ?? "—",
    },
  ];

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
      {isLoading ? (
        <LoadingSkeleton rows={8} columns={5} />
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
