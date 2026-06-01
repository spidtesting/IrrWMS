"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EntryForm } from "@/components/stock-entry/EntryForm";
import { useCreateStockEntry } from "@/hooks/api/use-stock-entry";
import { useWarehouseList } from "@/hooks/api/use-warehouse";
import { Card, CardContent } from "@/components/ui/card";

export default function NewStockEntryPage() {
  const t = useTranslations("stockEntry");
  const router = useRouter();
  const createEntry = useCreateStockEntry();
  const { data: warehouses } = useWarehouseList({ limit: 100 });

  async function handleSubmit(values: Record<string, unknown>) {
    try {
      await createEntry.mutateAsync(values);
      toast.success(t("entryCreated"));
      router.push("/stock-entry");
    } catch {
      toast.error(t("createFailed"));
    }
  }

  return (
    <div>
      <PageHeader
        title={t("newEntry")}
        breadcrumbs={[{ label: t("title"), href: "/stock-entry" }, { label: t("newEntry") }]}
      />
      <Card>
        <CardContent className="pt-6">
          <EntryForm
            warehouses={warehouses?.data?.map((w) => ({
              id: w.id,
              nameEn: w.nameEn,
            }))}
            onSubmit={handleSubmit}
            isSubmitting={createEntry.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
