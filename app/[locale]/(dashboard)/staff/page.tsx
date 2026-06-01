"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PageHeader, PageActionButton } from "@/components/dashboard/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useStaffList } from "@/hooks/api/use-staff";
import { Button } from "@/components/ui/button";
import type { UserRef } from "@/types/entities";

export default function StaffPage() {
  const t = useTranslations("staff");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading } = useStaffList({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
  });

  const columns: DataTableColumn<UserRef>[] = [
    {
      id: "employeeId",
      header: t("employeeId"),
      cell: (r) => <span className="font-mono">{r.employeeId}</span>,
    },
    {
      id: "name",
      header: t("name"),
      cell: (r) => <BilingualLabel en={r.fullNameEn} si={r.fullNameSi} />,
    },
    {
      id: "email",
      header: t("email"),
      cell: (r) => r.email ?? "—",
    },
    {
      id: "role",
      header: t("role"),
      cell: (r) => (r.role ? <StatusBadge status={r.role} /> : "—"),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/staff/tasks">{t("viewTasks")}</Link>
            </Button>
          </div>
        }
      />
      <SearchBar
        value={search}
        onChange={setSearch}
        onDebouncedChange={setDebouncedSearch}
        placeholder={t("searchPlaceholder")}
        className="mb-4 max-w-md"
      />
      {isLoading ? (
        <LoadingSkeleton rows={6} columns={4} />
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
