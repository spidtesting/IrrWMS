"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { Button } from "@/components/ui/button";
import { formatDate, formatQuantity } from "@/lib/utils/formatters";
import type { GINRecord } from "@/types/entities";

export type GINDetailProps = {
  gin: GINRecord;
  onApprove?: () => void;
  onReject?: () => void;
  isUpdating?: boolean;
};

export function GINDetail({ gin, onApprove, onReject, isUpdating }: GINDetailProps) {
  const t = useTranslations("goodsIssued");

  const lineColumns: DataTableColumn<GINRecord["lines"][0]>[] = [
    {
      id: "item",
      header: t("item"),
      cell: (row) => <BilingualLabel en={row.item.nameEn} si={row.item.nameSi} />,
    },
    {
      id: "requested",
      header: t("requestedQty"),
      cell: (row) => formatQuantity(row.requestedQty, row.item.unit),
    },
    {
      id: "issued",
      header: t("issuedQty"),
      cell: (row) => formatQuantity(row.issuedQty, row.item.unit),
    },
    {
      id: "bin",
      header: t("binLocation"),
      cell: (row) => row.binLocation?.code ?? "—",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-mono">{gin.ginNo}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("issueDate")}: {formatDate(gin.issueDate)}
            </p>
          </div>
          <StatusBadge status={gin.status} />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">{t("issuedTo")}</p>
            <BilingualLabel en={gin.issuedTo.fullNameEn} si={gin.issuedTo.fullNameSi} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("warehouse")}</p>
            <BilingualLabel en={gin.warehouse.nameEn} si={gin.warehouse.nameSi} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("lines")}</p>
            <p className="font-semibold">{gin.lines.length}</p>
          </div>
        </CardContent>
      </Card>

      <DataTable columns={lineColumns} data={gin.lines} getRowKey={(row) => row.id} />

      {gin.status === "PENDING" && onApprove && onReject && (
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
