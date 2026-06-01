"use client";

import { useTranslations } from "next-intl";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { Input } from "@/components/ui/input";
import { formatQuantity } from "@/lib/utils/formatters";
import type { PhysicalCountLine } from "@/types/entities";
import { cn } from "@/lib/utils";

export type CountLineTableProps = {
  lines: PhysicalCountLine[];
  editable?: boolean;
  onCountChange?: (lineId: string, countedQty: number) => void;
};

export function CountLineTable({ lines, editable, onCountChange }: CountLineTableProps) {
  const t = useTranslations("physicalCount");

  const columns: DataTableColumn<PhysicalCountLine>[] = [
    {
      id: "item",
      header: t("item"),
      cell: (row) => <BilingualLabel en={row.item.nameEn} si={row.item.nameSi} />,
    },
    {
      id: "bin",
      header: t("bin"),
      cell: (row) => row.binLocation?.code ?? "—",
    },
    {
      id: "expected",
      header: t("expectedQty"),
      cell: (row) => formatQuantity(row.expectedQty, row.item.unit),
    },
    {
      id: "counted",
      header: t("countedQty"),
      cell: (row) =>
        editable && onCountChange ? (
          <Input
            type="number"
            className="w-24"
            defaultValue={row.countedQty ?? ""}
            onChange={(e) => onCountChange(row.id, parseFloat(e.target.value) || 0)}
          />
        ) : (
          formatQuantity(row.countedQty ?? 0, row.item.unit)
        ),
    },
    {
      id: "variance",
      header: t("variance"),
      cell: (row) => {
        const variance = (row.countedQty ?? 0) - row.expectedQty;
        return (
          <span
            className={cn(
              "font-mono",
              variance > 0 && "text-emerald-600",
              variance < 0 && "text-destructive",
            )}
          >
            {variance > 0 ? "+" : ""}
            {formatQuantity(variance, row.item.unit)}
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={lines}
      getRowKey={(row) => row.id}
      emptyMessage={t("noLines")}
    />
  );
}
