"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useSupplierList } from "@/hooks/api/use-suppliers";
import type { SupplierRef } from "@/types/entities";

export default function SuppliersPage() {
  const t = useTranslations("suppliers");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading } = useSupplierList({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
  });

  const columns: DataTableColumn<SupplierRef>[] = [
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
      id: "contact",
      header: t("contact"),
      cell: (r) => r.contact ?? "—",
    },
    {
      id: "email",
      header: t("email"),
      cell: (r) => r.email ?? "—",
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
          onRowClick={(r) => router.push(`/suppliers/${r.id}`)}
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
