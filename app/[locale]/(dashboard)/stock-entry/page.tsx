"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { PageHeader, PageActionButton } from "@/components/dashboard/PageHeader";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { EntryTable } from "@/components/stock-entry/EntryTable";
import { ExportButtons } from "@/components/reports/ExportButtons";
import { stockEntryExportColumns } from "@/lib/utils/export";
import { useStockEntryList } from "@/hooks/api/use-stock-entry";
import { Button } from "@/components/ui/button";

export default function StockEntryPage() {
  const t = useTranslations("stockEntry");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useStockEntryList({ page, limit: 20 });

  const rows = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/stock-entry/approve">{t("approveEntries")}</Link>
            </Button>
            <PageActionButton href="/stock-entry/new" label={t("newEntry")} />
          </div>
        }
      />
      <div className="mb-4">
        <ExportButtons
          data={rows.map((r) => ({
            entryNumber: r.entryNumber,
            type: r.type,
            itemName: r.item.nameEn,
            quantity: r.quantity,
            status: r.status,
            createdAt: r.createdAt,
            warehouse: r.warehouse.nameEn,
          }))}
          columns={stockEntryExportColumns}
          filePrefix="stock-entry"
        />
      </div>
      <EntryTable data={rows} isLoading={isLoading} />
      {data?.meta && (
        <PaginationControls
          className="mt-4"
          page={data.meta.page}
          pageSize={data.meta.limit}
          totalItems={data.meta.total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
