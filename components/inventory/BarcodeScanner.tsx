"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type BarcodeScannerProps = {
  onScan: (code: string) => void;
  active?: boolean;
  stopOnScan?: boolean;
  showManualInput?: boolean;
  containerId?: string;
  className?: string;
};

export function BarcodeScanner({
  onScan,
  active = true,
  stopOnScan = true,
  showManualInput = false,
  containerId: containerIdProp,
  className,
}: BarcodeScannerProps) {
  const t = useTranslations("common");
  const generatedId = useId().replace(/:/g, "");
  const containerId = containerIdProp ?? `barcode-scanner-${generatedId}`;
  const [manualCode, setManualCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const handleScan = useCallback(
    (code: string) => {
      const trimmed = code.trim();
      if (!trimmed) return;
      setManualCode(trimmed);
      onScanRef.current(trimmed);
      if (stopOnScan && scannerRef.current) {
        void scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    },
    [stopOnScan],
  );

  useEffect(() => {
    if (!active) {
      if (scannerRef.current) {
        void scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
      return;
    }

    let cancelled = false;

    async function startScanner() {
      setError(null);
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;

        const scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 280, height: 160 } },
          handleScan,
          () => {},
        );
      } catch {
        if (!cancelled) {
          setError(t("cameraError"));
        }
      }
    }

    void startScanner();

    return () => {
      cancelled = true;
      if (scannerRef.current) {
        void scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [active, containerId, handleScan, t]);

  function handleManualSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (manualCode.trim()) handleScan(manualCode.trim());
  }

  return (
    <div className={cn("space-y-4", className)}>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div
        id={containerId}
        className={cn(
          "min-h-[240px] overflow-hidden rounded-lg border bg-muted",
          !active && "hidden",
        )}
      />

      {showManualInput && (
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <Input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder={t("enterBarcode")}
            className="font-mono"
          />
          <button
            type="submit"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-secondary px-4 text-sm font-medium"
          >
            {t("lookup")}
          </button>
        </form>
      )}
    </div>
  );
}
