"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EntryTable } from "@/components/stock-entry/EntryTable";
import { usePendingStockEntries, useApproveStockEntry } from "@/hooks/api/use-stock-entry";
import { Button } from "@/components/ui/button";

export default function ApproveStockEntryPage() {
  const t = useTranslations("stockEntry");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data, isLoading, refetch } = usePendingStockEntries({ limit: 50 });
  const approve = useApproveStockEntry();

  function handleSelect(id: string, checked: boolean) {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  }

  async function handleAction(action: "APPROVED" | "REJECTED") {
    if (selectedIds.length === 0) {
      toast.error(t("selectEntries"));
      return;
    }
    try {
      await approve.mutateAsync({ ids: selectedIds, action });
      toast.success(action === "APPROVED" ? t("approved") : t("rejected"));
      setSelectedIds([]);
      void refetch();
    } catch {
      toast.error(t("actionFailed"));
    }
  }

  return (
    <div>
      <PageHeader
        title={t("approveEntries")}
        description={t("approveDescription")}
        breadcrumbs={[{ label: t("title"), href: "/stock-entry" }, { label: t("approveEntries") }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/stock-entry">{t("back")}</Link>
          </Button>
        }
      />

      <div className="mb-4 flex gap-2">
        <Button
          onClick={() => void handleAction("APPROVED")}
          disabled={approve.isPending || selectedIds.length === 0}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {t("approveSelected")} ({selectedIds.length})
        </Button>
        <Button
          variant="destructive"
          onClick={() => void handleAction("REJECTED")}
          disabled={approve.isPending || selectedIds.length === 0}
        >
          <XCircle className="mr-2 h-4 w-4" />
          {t("rejectSelected")}
        </Button>
      </div>

      <EntryTable
        data={data?.data ?? []}
        isLoading={isLoading}
        showActions
        selectedIds={selectedIds}
        onSelect={handleSelect}
      />
    </div>
  );
}
