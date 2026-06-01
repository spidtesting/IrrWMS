"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type VirtualTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  width?: number | string;
  className?: string;
  headerClassName?: string;
};

export type VirtualTableProps<T> = {
  columns: VirtualTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  rowHeight?: number;
  maxHeight?: number | string;
  emptyMessage?: React.ReactNode;
  className?: string;
  onRowClick?: (row: T) => void;
};

function VirtualTable<T>({
  columns,
  data,
  getRowKey,
  rowHeight = 48,
  maxHeight = 480,
  emptyMessage = "No results found.",
  className,
  onRowClick,
}: VirtualTableProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? (virtualRows[0]?.start ?? 0) : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - (virtualRows[virtualRows.length - 1]?.end ?? 0) : 0;

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={column.headerClassName}
                style={column.width !== undefined ? { width: column.width } : undefined}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      </Table>

      <div ref={parentRef} className="overflow-auto" style={{ maxHeight }}>
        {data.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <Table>
            <TableBody>
              {paddingTop > 0 && (
                <TableRow aria-hidden>
                  <TableCell
                    colSpan={columns.length}
                    style={{ height: paddingTop, padding: 0, border: 0 }}
                  />
                </TableRow>
              )}

              {virtualRows.map((virtualRow) => {
                const row = data[virtualRow.index];
                if (!row) return null;

                return (
                  <TableRow
                    key={getRowKey(row)}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={column.className}
                        style={column.width !== undefined ? { width: column.width } : undefined}
                      >
                        {column.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}

              {paddingBottom > 0 && (
                <TableRow aria-hidden>
                  <TableCell
                    colSpan={columns.length}
                    style={{ height: paddingBottom, padding: 0, border: 0 }}
                  />
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export { VirtualTable };
