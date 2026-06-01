"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useWarehouse, useWarehouseStats } from "@/hooks/api/use-warehouse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatQuantity } from "@/lib/utils/formatters";

export default function WarehouseDetailPage() {
  const t = useTranslations("warehouse");
  const params = useParams();
  const id = params.id as string;
  const { data: warehouse, isLoading } = useWarehouse(id);
  const { data: stats } = useWarehouseStats(id);

  if (isLoading) return <LoadingSkeleton rows={4} columns={3} />;
  if (!warehouse) return <p>{t("notFound")}</p>;

  return (
    <div>
      <PageHeader
        title={<BilingualLabel en={warehouse.nameEn} si={warehouse.nameSi} />}
        description={<span className="font-mono text-sm">{warehouse.code}</span>}
        breadcrumbs={[{ label: t("title"), href: "/warehouse" }, { label: warehouse.code }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/warehouse">{t("back")}</Link>
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("location")}</span>
              <span>{warehouse.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("district")}</span>
              <span>{warehouse.district}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("capacity")}</span>
              <span>{formatQuantity(warehouse.capacity)}</span>
            </div>
          </CardContent>
        </Card>

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>{t("statistics")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t("itemCount")}</p>
                <p className="text-2xl font-bold text-primary">{stats.itemCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("totalStock")}</p>
                <p className="text-2xl font-bold">{formatQuantity(stats.totalStock)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("lowStock")}</p>
                <p className="text-2xl font-bold text-amber-600">{stats.lowStockCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("pendingEntries")}</p>
                <p className="text-2xl font-bold">{stats.pendingEntries}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
