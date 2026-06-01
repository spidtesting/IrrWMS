"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useSupplier } from "@/hooks/api/use-suppliers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupplierDetailPage() {
  const t = useTranslations("suppliers");
  const params = useParams();
  const id = params.id as string;
  const { data: supplier, isLoading } = useSupplier(id);

  if (isLoading) return <LoadingSkeleton rows={4} columns={2} />;
  if (!supplier) return <p>{t("notFound")}</p>;

  return (
    <div>
      <PageHeader
        title={<BilingualLabel en={supplier.nameEn} si={supplier.nameSi} />}
        description={<span className="font-mono text-sm">{supplier.code}</span>}
        breadcrumbs={[{ label: t("title"), href: "/suppliers" }, { label: supplier.code }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/suppliers">{t("back")}</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("contactInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("contact")}</span>
              <span>{supplier.contact}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("email")}</span>
              <span>{supplier.email ?? "—"}</span>
            </div>
            <div>
              <p className="text-muted-foreground">{t("address")}</p>
              <p className="mt-1">{supplier.address}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("statistics")}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("itemCount")}</p>
              <p className="text-2xl font-bold text-primary">{supplier.itemCount ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("poCount")}</p>
              <p className="text-2xl font-bold">{supplier.poCount ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
