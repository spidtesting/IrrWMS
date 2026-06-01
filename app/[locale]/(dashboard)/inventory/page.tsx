"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, PageActionButton } from "@/components/dashboard/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { ExportButtons } from "@/components/reports/ExportButtons";
import { inventoryExportColumns } from "@/lib/utils/export";
import { useInventoryList } from "@/hooks/api/use-inventory";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function InventoryPage() {
  const t = useTranslations("inventory");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const { data, isLoading, isError, refetch } = useInventoryList({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    lowStockOnly,
  });

  const rows = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
        action={
          <div className="flex gap-2">
            <ExportButtons
              data={rows.map((r) => ({
                itemCode: r.item.itemCode,
                nameEn: r.item.nameEn,
                nameSi: r.item.nameSi,
                category: r.item.category?.nameEn ?? "",
                currentStock: r.currentStock,
                reservedStock: r.reservedStock,
                availableStock: r.availableStock,
                unit: r.item.unit,
                unitPrice: Number(r.item.unitPrice ?? 0),
                warehouse: r.warehouse?.nameEn ?? "",
              }))}
              columns={inventoryExportColumns}
              filePrefix="inventory"
            />
            <PageActionButton href="/inventory/add" label={t("addItem")} />
          </div>
        }
      />

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          onDebouncedChange={setDebouncedSearch}
          placeholder={t("searchPlaceholder")}
          className="max-w-md"
        />
        <div className="flex items-center gap-2">
          <Switch id="low-stock" checked={lowStockOnly} onCheckedChange={setLowStockOnly} />
          <Label htmlFor="low-stock" className="text-sm">
            {t("lowStockOnly")}
          </Label>
        </div>
      </div>

      {isError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          {t("loadError")}
          <Button variant="link" size="sm" onClick={() => void refetch()}>
            {t("retry")}
          </Button>
        </div>
      )}

      <InventoryTable data={rows} isLoading={isLoading} />

      {meta && (
        <PaginationControls
          className="mt-4"
          page={meta.page}
          pageSize={meta.limit}
          totalItems={meta.total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
