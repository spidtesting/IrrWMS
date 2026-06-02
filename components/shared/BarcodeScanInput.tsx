"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { ScanLine, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const BarcodeScanner = dynamic(
  () => import("@/components/inventory/BarcodeScanner").then((mod) => mod.BarcodeScanner),
  { ssr: false },
);

export type BarcodeScanInputProps = {
  value: string;
  onChange: (value: string) => void;
  onScanComplete?: (code: string) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  showLookupButton?: boolean;
  className?: string;
  inputClassName?: string;
};

export function BarcodeScanInput({
  value,
  onChange,
  onScanComplete,
  placeholder,
  disabled = false,
  loading = false,
  showLookupButton = true,
  className,
  inputClassName,
}: BarcodeScanInputProps) {
  const t = useTranslations("common");
  const [scannerOpen, setScannerOpen] = useState(false);

  const applyCode = useCallback(
    async (code: string) => {
      const trimmed = code.trim();
      if (!trimmed) return;
      onChange(trimmed);
      setScannerOpen(false);
      await onScanComplete?.(trimmed);
    },
    [onChange, onScanComplete],
  );

  async function handleLookup() {
    await applyCode(value);
  }

  return (
    <>
      <div className={cn("flex gap-2", className)}>
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? t("enterBarcode")}
            className={cn("pr-10 font-mono", inputClassName)}
            disabled={disabled || loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void handleLookup();
              }
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full w-10 shrink-0 text-primary hover:text-primary"
            onClick={() => setScannerOpen(true)}
            disabled={disabled || loading}
            aria-label={t("scanWithCamera")}
          >
            <ScanLine className="h-4 w-4" />
          </Button>
        </div>
        {showLookupButton && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => void handleLookup()}
            disabled={disabled || loading || !value.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("searching")}
              </>
            ) : (
              t("lookup")
            )}
          </Button>
        )}
      </div>

      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("scanWithCamera")}</DialogTitle>
            <DialogDescription>{t("scanBarcodeHint")}</DialogDescription>
          </DialogHeader>
          {scannerOpen ? (
            <BarcodeScanner
              active={scannerOpen}
              onScan={(code) => void applyCode(code)}
              stopOnScan
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
