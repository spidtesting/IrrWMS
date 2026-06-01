"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type BarcodeScannerProps = {
  onScan: (code: string) => void;
  className?: string;
  autoStart?: boolean;
};

export function BarcodeScanner({ onScan, className, autoStart = false }: BarcodeScannerProps) {
  const t = useTranslations("inventory");
  const [isScanning, setIsScanning] = useState(autoStart);
  const [manualCode, setManualCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "barcode-scanner-region";

  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decoded) => {
          onScan(decoded);
          setManualCode(decoded);
        },
        () => {},
      )
      .catch(() => {
        setError(t("cameraError"));
        setIsScanning(false);
      });

    return () => {
      void scanner.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, [isScanning, onScan, t]);

  function handleManualSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (manualCode.trim()) onScan(manualCode.trim());
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={isScanning ? "destructive" : "default"}
          onClick={() => {
            setError(null);
            setIsScanning((v) => !v);
          }}
        >
          {isScanning ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" />
              {t("stopScanner")}
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              {t("startScanner")}
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div
        id={containerId}
        className={cn("overflow-hidden rounded-lg border bg-muted", !isScanning && "hidden")}
      />

      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <Input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder={t("manualBarcode")}
          className="font-mono"
        />
        <Button type="submit" variant="secondary">
          {t("lookup")}
        </Button>
      </form>
    </div>
  );
}
