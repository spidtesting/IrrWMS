"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useWarehouseList } from "@/hooks/api/use-warehouse";
import type { WarehouseRef } from "@/types/entities";

export default function WarehousePage() {
  const t = useTranslations("warehouse");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading } = useWarehouseList({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
  });

  const columns: DataTableColumn<WarehouseRef>[] = [
    {
      id: "code",
      header: t("code"),
      cell: (r) => <span className="font-mono">{r.code}</span>,
    },
    {
      id: "name",
      header: t("name"),
      cell: (r) => <BilingualLabel en={r.nameEn} si={r.nameSi} />,
    },
    {
      id: "location",
      header: t("location"),
      cell: (r) => r.location ?? "—",
    },
    {
      id: "district",
      header: t("district"),
      cell: (r) => r.district ?? "—",
    },
  ];

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
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
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          getRowKey={(r) => r.id}
          onRowClick={(r) => router.push(`/warehouse/${r.id}`)}
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
