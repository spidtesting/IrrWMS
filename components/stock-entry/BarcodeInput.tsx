"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ScanLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import type { ItemRef } from "@/types/entities";

export type BarcodeInputProps = {
  onItemFound: (itemId: string, item?: ItemRef) => void;
};

export function BarcodeInput({ onItemFound }: BarcodeInputProps) {
  const t = useTranslations("stockEntry");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundItem, setFoundItem] = useState<ItemRef | null>(null);

  async function lookup() {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const item = await api.get<ItemRef>("/inventory/by-barcode", {
        barcode: code.trim(),
      });
      setFoundItem(item);
      onItemFound(item.id, item);
    } catch {
      setError(t("barcodeNotFound"));
      setFoundItem(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <ScanLine className="h-4 w-4 text-primary" />
        {t("scanBarcode")}
      </div>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("enterBarcode")}
          className="font-mono"
          onKeyDown={(e) => e.key === "Enter" && void lookup()}
        />
        <Button type="button" onClick={() => void lookup()} disabled={loading}>
          {loading ? t("searching") : t("lookup")}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {foundItem && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          ✓ {foundItem.itemCode} — {foundItem.nameEn}
        </p>
      )}
    </div>
  );
}
