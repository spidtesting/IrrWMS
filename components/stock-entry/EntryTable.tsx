"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { formatDateTime, formatQuantity } from "@/lib/utils/formatters";
import type { StockEntryRecord } from "@/types/entities";

export type EntryTableProps = {
  data: StockEntryRecord[];
  isLoading?: boolean;
  showActions?: boolean;
  selectedIds?: string[];
  onSelect?: (id: string, checked: boolean) => void;
};

export function EntryTable({
  data,
  isLoading,
  showActions,
  selectedIds = [],
  onSelect,
}: EntryTableProps) {
  const t = useTranslations("stockEntry");
  const router = useRouter();

  const columns: DataTableColumn<StockEntryRecord>[] = [
    ...(showActions && onSelect
      ? [
          {
            id: "select",
            header: "",
            cell: (row: StockEntryRecord) => (
              <input
                type="checkbox"
                checked={selectedIds.includes(row.id)}
                onChange={(e) => onSelect(row.id, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
            ),
          } as DataTableColumn<StockEntryRecord>,
        ]
      : []),
    {
      id: "entryNumber",
      header: t("entryNo"),
      cell: (row) => <span className="font-mono text-sm">{row.entryNumber}</span>,
    },
    {
      id: "type",
      header: t("type"),
      cell: (row) => <StatusBadge status={row.type} />,
    },
    {
      id: "item",
      header: t("item"),
      cell: (row) => row.item.nameEn,
    },
    {
      id: "quantity",
      header: t("quantity"),
      cell: (row) => formatQuantity(row.quantity, row.item.unit),
    },
    {
      id: "status",
      header: t("status"),
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "createdAt",
      header: t("date"),
      cell: (row) => formatDateTime(row.createdAt),
    },
  ];

  if (isLoading) return <LoadingSkeleton rows={6} columns={6} />;

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowKey={(row) => row.id}
      emptyMessage={t("empty")}
    />
  );
}
