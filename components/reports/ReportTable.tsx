"use client";

import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export type ReportTableProps<T extends { id: string }> = {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
};

export function ReportTable<T extends { id: string }>({
  columns,
  data,
  isLoading,
  emptyMessage = "No data available.",
  onRowClick,
}: ReportTableProps<T>) {
  if (isLoading) return <LoadingSkeleton rows={8} columns={columns.length} />;

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowKey={(row) => row.id}
      emptyMessage={emptyMessage}
      onRowClick={onRowClick}
    />
  );
}
