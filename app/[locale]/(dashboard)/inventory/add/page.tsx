"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ItemForm, type ItemFormValues } from "@/components/inventory/ItemForm";
import { useCreateItem } from "@/hooks/api/use-inventory";
import { useWarehouseList } from "@/hooks/api/use-warehouse";
import { useSupplierList } from "@/hooks/api/use-suppliers";
import { Card, CardContent } from "@/components/ui/card";

export default function AddInventoryPage() {
  const t = useTranslations("inventory");
  const router = useRouter();
  const createItem = useCreateItem();
  const { data: warehouses } = useWarehouseList({ limit: 100 });
  const { data: suppliers } = useSupplierList({ limit: 100 });

  async function handleSubmit(values: ItemFormValues) {
    try {
      const item = await createItem.mutateAsync(values);
      toast.success(t("itemCreated"));
      router.push(`/inventory/${item.id}`);
    } catch {
      toast.error(t("createFailed"));
    }
  }

  return (
    <div>
      <PageHeader
        title={t("addItem")}
        description={t("addDescription")}
        breadcrumbs={[{ label: t("title"), href: "/inventory" }, { label: t("addItem") }]}
      />
      <Card>
        <CardContent className="pt-6">
          <ItemForm
            warehouses={warehouses?.data?.map((w) => ({
              id: w.id,
              nameEn: w.nameEn,
            }))}
            suppliers={suppliers?.data?.map((s) => ({
              id: s.id,
              nameEn: s.nameEn,
            }))}
            onSubmit={handleSubmit}
            isSubmitting={createItem.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
