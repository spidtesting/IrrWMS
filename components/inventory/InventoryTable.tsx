"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency, formatQuantity } from "@/lib/utils/formatters";
import type { InventoryRecord } from "@/types/entities";
import { StockBadge } from "./StockBadge";

export type InventoryTableProps = {
  data: InventoryRecord[];
  isLoading?: boolean;
  onRowClick?: (row: InventoryRecord) => void;
};

export function InventoryTable({ data, isLoading, onRowClick }: InventoryTableProps) {
  const t = useTranslations("inventory");
  const router = useRouter();

  const columns: DataTableColumn<InventoryRecord>[] = [
    {
      id: "code",
      header: t("itemCode"),
      cell: (row) => <span className="font-mono text-sm">{row.item.itemCode}</span>,
    },
    {
      id: "name",
      header: t("itemName"),
      cell: (row) => <BilingualLabel en={row.item.nameEn} si={row.item.nameSi} />,
    },
    {
      id: "stock",
      header: t("currentStock"),
      cell: (row) => (
        <StockBadge
          current={row.currentStock}
          min={row.item.unit ? 0 : 0}
          reorderLevel={0}
          unit={row.item.unit}
        />
      ),
    },
    {
      id: "available",
      header: t("available"),
      cell: (row) => formatQuantity(row.availableStock, row.item.unit),
    },
    {
      id: "reserved",
      header: t("reserved"),
      cell: (row) => formatQuantity(row.reservedStock, row.item.unit),
    },
    {
      id: "value",
      header: t("value"),
      cell: (row) => formatCurrency(Number(row.item.unitPrice ?? 0) * row.currentStock),
    },
  ];

  if (isLoading) return <LoadingSkeleton rows={8} columns={6} />;

  if (data.length === 0) {
    return (
      <EmptyState
        title={t("emptyTitle")}
        description={t("emptyDescription")}
        actionLabel={t("addItem")}
        onAction={() => router.push("/inventory/add")}
      />
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowKey={(row) => row.id}
      onRowClick={onRowClick ?? ((row) => router.push(`/inventory/${row.itemId}`))}
      emptyMessage={t("emptyTitle")}
    />
  );
}
