"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GRNForm, type GRNFormValues } from "@/components/goods-received/GRNForm";
import { useCreateGRN } from "@/hooks/api/use-grn";
import { useWarehouseList } from "@/hooks/api/use-warehouse";
import { useSupplierList } from "@/hooks/api/use-suppliers";
import { Card, CardContent } from "@/components/ui/card";

export default function NewGRNPage() {
  const t = useTranslations("goodsReceived");
  const router = useRouter();
  const createGRN = useCreateGRN();
  const { data: warehouses } = useWarehouseList({ limit: 100 });
  const { data: suppliers } = useSupplierList({ limit: 100 });

  async function handleSubmit(values: GRNFormValues) {
    try {
      const grn = await createGRN.mutateAsync(values);
      toast.success(t("created"));
      router.push(`/goods-received/${grn.id}`);
    } catch {
      toast.error(t("createFailed"));
    }
  }

  return (
    <div>
      <PageHeader
        title={t("newGRN")}
        breadcrumbs={[{ label: t("title"), href: "/goods-received" }, { label: t("newGRN") }]}
      />
      <Card>
        <CardContent className="pt-6">
          <GRNForm
            suppliers={suppliers?.data?.map((s) => ({
              id: s.id,
              nameEn: s.nameEn,
            }))}
            warehouses={warehouses?.data?.map((w) => ({
              id: w.id,
              nameEn: w.nameEn,
            }))}
            onSubmit={handleSubmit}
            isSubmitting={createGRN.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
