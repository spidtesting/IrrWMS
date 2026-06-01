"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

export type QRCodeDisplayProps = {
  value: string;
  size?: number;
  label?: string;
  className?: string;
};

export function QRCodeDisplay({ value, size = 128, label, className }: QRCodeDisplayProps) {
  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      <div className="rounded-lg border bg-white p-2">
        <QRCodeSVG value={value} size={size} level="M" />
      </div>
      {label && <span className="font-mono text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}
