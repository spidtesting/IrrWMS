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
import { useGRNList } from "@/hooks/api/use-grn";
import { formatDate } from "@/lib/utils/formatters";
import type { GRNRecord } from "@/types/entities";

export default function GoodsReceivedPage() {
  const t = useTranslations("goodsReceived");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading } = useGRNList({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
  });

  const columns: DataTableColumn<GRNRecord>[] = [
    {
      id: "grnNo",
      header: t("grnNo"),
      cell: (r) => <span className="font-mono">{r.grnNo}</span>,
    },
    {
      id: "supplier",
      header: t("supplier"),
      cell: (r) => <BilingualLabel en={r.supplier.nameEn} si={r.supplier.nameSi} />,
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
      header: t("received"),
      cell: (r) => formatDate(r.receivedDate),
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
        action={<PageActionButton href="/goods-received/new" label={t("newGRN")} />}
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
          onRowClick={(r) => router.push(`/goods-received/${r.id}`)}
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
