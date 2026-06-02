"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { ScanLine } from "lucide-react";
import { BarcodeScanInput } from "@/components/shared/BarcodeScanInput";
import { api } from "@/lib/api/client";
import type { BarcodeLookupResult } from "@/types/entities";

export type BarcodeInputProps = {
  onItemFound: (item: BarcodeLookupResult) => void;
};

export function BarcodeInput({ onItemFound }: BarcodeInputProps) {
  const t = useTranslations("stockEntry");
  const tCommon = useTranslations("common");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundItem, setFoundItem] = useState<BarcodeLookupResult | null>(null);

  const lookup = useCallback(
    async (barcode: string) => {
      if (!barcode.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const item = await api.get<BarcodeLookupResult>("/inventory/by-barcode", {
          barcode: barcode.trim(),
        });
        setFoundItem(item);
        onItemFound(item);
      } catch {
        setError(t("barcodeNotFound"));
        setFoundItem(null);
      } finally {
        setLoading(false);
      }
    },
    [onItemFound, t],
  );

  return (
    <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <ScanLine className="h-4 w-4 text-primary" />
        {t("scanBarcode")}
      </div>
      <BarcodeScanInput
        value={code}
        onChange={setCode}
        onScanComplete={lookup}
        placeholder={t("enterBarcode")}
        loading={loading}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {foundItem && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          ✓ {foundItem.itemCode} — {foundItem.nameEn}
        </p>
      )}
      <p className="text-xs text-muted-foreground">{tCommon("scanBarcodeHint")}</p>
    </div>
  );
}
