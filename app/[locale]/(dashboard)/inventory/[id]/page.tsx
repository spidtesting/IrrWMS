"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ItemCard } from "@/components/inventory/ItemCard";
import { QRCodeDisplay } from "@/components/inventory/QRCodeDisplay";
import { StockBadge } from "@/components/inventory/StockBadge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { useInventoryItem } from "@/hooks/api/use-inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatQuantity } from "@/lib/utils/formatters";

export default function InventoryDetailPage() {
  const t = useTranslations("inventory");
  const params = useParams();
  const id = params.id as string;
  const { data: item, isLoading, isError } = useInventoryItem(id);

  if (isLoading) return <LoadingSkeleton rows={6} columns={3} />;

  if (isError || !item) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{t("notFound")}</p>
        <Button asChild className="mt-4">
          <Link href="/inventory">{t("backToList")}</Link>
        </Button>
      </div>
    );
  }

  const stock = item.inventory?.[0]?.currentStock ?? 0;

  return (
    <div>
      <PageHeader
        title={<BilingualLabel en={item.nameEn} si={item.nameSi} />}
        description={<span className="font-mono text-sm">{item.itemCode}</span>}
        breadcrumbs={[{ label: t("title"), href: "/inventory" }, { label: item.itemCode }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/inventory">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back")}
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ItemCard item={item} stock={stock} href="#" />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("stockDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">{t("currentStock")}</p>
                <StockBadge
                  current={stock}
                  min={item.minStock}
                  reorderLevel={item.reorderLevel}
                  unit={item.unit}
                  className="mt-1"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("reorderLevel")}</p>
                <p className="font-semibold">{formatQuantity(item.reorderLevel, item.unit)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("unitPrice")}</p>
                <p className="font-semibold">{formatCurrency(Number(item.unitPrice))}</p>
              </div>
            </CardContent>
          </Card>

          {item.barcode && (
            <Card>
              <CardHeader>
                <CardTitle>{t("barcode")}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <QRCodeDisplay value={item.barcode} label={item.barcode} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
