"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader, PageActionButton } from "@/components/dashboard/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useGINList } from "@/hooks/api/use-gin";
import { formatDate } from "@/lib/utils/formatters";
import type { GINRecord } from "@/types/entities";

export default function GoodsIssuedPage() {
  const t = useTranslations("goodsIssued");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading } = useGINList({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
  });

  const columns: DataTableColumn<GINRecord>[] = [
    {
      id: "ginNo",
      header: t("ginNo"),
      cell: (r) => <span className="font-mono">{r.ginNo}</span>,
    },
    {
      id: "issuedTo",
      header: t("issuedTo"),
      cell: (r) => <BilingualLabel en={r.issuedTo.fullNameEn} si={r.issuedTo.fullNameSi} />,
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
      id: "date",
      header: t("issueDate"),
      cell: (r) => formatDate(r.issueDate),
    },
    {
      id: "lines",
      header: t("lines"),
      cell: (r) => r.lines.length,
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
        action={<PageActionButton href="/goods-issued/new" label={t("newGIN")} />}
      />
      <SearchBar
        value={search}
        onChange={setSearch}
        onDebouncedChange={setDebouncedSearch}
        placeholder={t("searchPlaceholder")}
        className="mb-4 max-w-md"
      />
      {isLoading ? (
        <LoadingSkeleton rows={6} columns={6} />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          getRowKey={(r) => r.id}
          onRowClick={(r) => router.push(`/goods-issued/${r.id}`)}
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
