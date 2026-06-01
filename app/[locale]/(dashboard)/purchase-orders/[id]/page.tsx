"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { usePurchaseOrder } from "@/hooks/api/use-purchase-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate, formatQuantity } from "@/lib/utils/formatters";
import type { PurchaseOrderRecord } from "@/types/entities";

export default function PurchaseOrderDetailPage() {
  const t = useTranslations("purchaseOrders");
  const params = useParams();
  const id = params.id as string;
  const { data: po, isLoading } = usePurchaseOrder(id);

  const lineColumns: DataTableColumn<PurchaseOrderRecord["lines"][0]>[] = [
    {
      id: "item",
      header: t("item"),
      cell: (r) => <BilingualLabel en={r.item.nameEn} si={r.item.nameSi} />,
    },
    {
      id: "qty",
      header: t("quantity"),
      cell: (r) => formatQuantity(r.quantity, r.item.unit),
    },
    {
      id: "price",
      header: t("unitPrice"),
      cell: (r) => formatCurrency(Number(r.unitPrice)),
    },
    {
      id: "total",
      header: t("lineTotal"),
      cell: (r) => formatCurrency(Number(r.unitPrice) * r.quantity),
    },
  ];

  if (isLoading) return <LoadingSkeleton rows={6} columns={4} />;
  if (!po) return <p>{t("notFound")}</p>;

  return (
    <div>
      <PageHeader
        title={po.poNo}
        breadcrumbs={[{ label: t("title"), href: "/purchase-orders" }, { label: po.poNo }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/purchase-orders">{t("back")}</Link>
          </Button>
        }
      />
      <Card className="mb-6">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>{po.poNo}</CardTitle>
          <StatusBadge status={po.status} />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">{t("supplier")}</p>
            <BilingualLabel en={po.supplier.nameEn} si={po.supplier.nameSi} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("expectedDate")}</p>
            <p>{formatDate(po.expectedDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("total")}</p>
            <p className="font-semibold">{formatCurrency(Number(po.totalAmount ?? 0))}</p>
          </div>
        </CardContent>
      </Card>
      <DataTable columns={lineColumns} data={po.lines} getRowKey={(r) => r.id} />
    </div>
  );
}
