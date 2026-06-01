"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, formatDateTime, formatQuantity } from "@/lib/utils/formatters";
import type { GRNRecord } from "@/types/entities";

export type GRNDetailProps = {
  grn: GRNRecord;
  onApprove?: () => void;
  onReject?: () => void;
  isUpdating?: boolean;
};

export function GRNDetail({ grn, onApprove, onReject, isUpdating }: GRNDetailProps) {
  const t = useTranslations("goodsReceived");

  const lineColumns: DataTableColumn<GRNRecord["lines"][0]>[] = [
    {
      id: "item",
      header: t("item"),
      cell: (row) => <BilingualLabel en={row.item.nameEn} si={row.item.nameSi} />,
    },
    {
      id: "ordered",
      header: t("orderedQty"),
      cell: (row) => formatQuantity(row.orderedQty, row.item.unit),
    },
    {
      id: "received",
      header: t("receivedQty"),
      cell: (row) => formatQuantity(row.receivedQty, row.item.unit),
    },
    {
      id: "price",
      header: t("unitPrice"),
      cell: (row) => formatCurrency(Number(row.unitPrice)),
    },
    {
      id: "total",
      header: t("lineTotal"),
      cell: (row) => formatCurrency(Number(row.unitPrice) * row.receivedQty),
    },
  ];

  const totalValue = grn.lines.reduce(
    (sum, line) => sum + Number(line.unitPrice) * line.receivedQty,
    0,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-mono">{grn.grnNo}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("received")}: {formatDate(grn.receivedDate)}
            </p>
          </div>
          <StatusBadge status={grn.status} />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">{t("supplier")}</p>
            <BilingualLabel en={grn.supplier.nameEn} si={grn.supplier.nameSi} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("warehouse")}</p>
            <BilingualLabel en={grn.warehouse.nameEn} si={grn.warehouse.nameSi} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("totalValue")}</p>
            <p className="font-semibold">{formatCurrency(totalValue)}</p>
          </div>
        </CardContent>
      </Card>

      <DataTable columns={lineColumns} data={grn.lines} getRowKey={(row) => row.id} />

      {grn.status === "PENDING" && onApprove && onReject && (
        <div className="flex gap-2">
          <Button onClick={onApprove} disabled={isUpdating}>
            <CheckCircle className="mr-2 h-4 w-4" />
            {t("approve")}
          </Button>
          <Button variant="destructive" onClick={onReject} disabled={isUpdating}>
            <XCircle className="mr-2 h-4 w-4" />
            {t("reject")}
          </Button>
        </div>
      )}
    </div>
  );
}
