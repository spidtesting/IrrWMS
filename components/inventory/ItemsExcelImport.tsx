"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ImportResult = {
  rowCount: number;
  itemsCreated: number;
  itemsUpdated: number;
  inventoryUpserted: number;
};

export function ItemsExcelImport({ onSuccess }: { onSuccess?: () => void }) {
  const t = useTranslations("inventory");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    if (!file.name.match(/\.xlsx?$/i)) {
      toast.error(t("importInvalidType"));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/v1/inventory/import", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message ?? t("importFailed"));
      }

      const data = json.data as ImportResult;
      toast.success(
        t("importSuccess", {
          count: data.rowCount,
          created: data.itemsCreated,
          updated: data.itemsUpdated,
        }),
      );
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("importFailed"));
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        {loading ? t("importing") : t("importExcel")}
      </Button>
    </div>
  );
}
