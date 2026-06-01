"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GINForm, type GINFormValues } from "@/components/goods-issued/GINForm";
import { useCreateGIN } from "@/hooks/api/use-gin";
import { useWarehouseList } from "@/hooks/api/use-warehouse";
import { useStaffList } from "@/hooks/api/use-staff";
import { Card, CardContent } from "@/components/ui/card";

export default function NewGINPage() {
  const t = useTranslations("goodsIssued");
  const router = useRouter();
  const createGIN = useCreateGIN();
  const { data: warehouses } = useWarehouseList({ limit: 100 });
  const { data: staff } = useStaffList({ limit: 100 });

  async function handleSubmit(values: GINFormValues) {
    try {
      const gin = await createGIN.mutateAsync(values);
      toast.success(t("created"));
      router.push(`/goods-issued/${gin.id}`);
    } catch {
      toast.error(t("createFailed"));
    }
  }

  return (
    <div>
      <PageHeader
        title={t("newGIN")}
        breadcrumbs={[{ label: t("title"), href: "/goods-issued" }, { label: t("newGIN") }]}
      />
      <Card>
        <CardContent className="pt-6">
          <GINForm
            warehouses={warehouses?.data?.map((w) => ({
              id: w.id,
              nameEn: w.nameEn,
            }))}
            staff={staff?.data?.map((s) => ({
              id: s.id,
              fullNameEn: s.fullNameEn,
            }))}
            onSubmit={handleSubmit}
            isSubmitting={createGIN.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
