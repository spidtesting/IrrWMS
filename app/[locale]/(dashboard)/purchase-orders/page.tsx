"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { usePurchaseOrderList } from "@/hooks/api/use-purchase-orders";
import { formatDate, formatCurrency } from "@/lib/utils/formatters";
import type { PurchaseOrderRecord } from "@/types/entities";

export default function PurchaseOrdersPage() {
  const t = useTranslations("purchaseOrders");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading } = usePurchaseOrderList({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
  });

  const columns: DataTableColumn<PurchaseOrderRecord>[] = [
    {
      id: "poNo",
      header: t("poNo"),
      cell: (r) => <span className="font-mono">{r.poNo}</span>,
    },
    {
      id: "supplier",
      header: t("supplier"),
      cell: (r) => <BilingualLabel en={r.supplier.nameEn} si={r.supplier.nameSi} />,
    },
    {
      id: "status",
      header: t("status"),
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      id: "expected",
      header: t("expectedDate"),
      cell: (r) => formatDate(r.expectedDate),
    },
    {
      id: "total",
      header: t("total"),
      cell: (r) => formatCurrency(Number(r.totalAmount ?? 0)),
    },
    {
      id: "lines",
      header: t("lines"),
      cell: (r) => r.lines.length,
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
        <LoadingSkeleton rows={6} columns={6} />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          getRowKey={(r) => r.id}
          onRowClick={(r) => router.push(`/purchase-orders/${r.id}`)}
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
