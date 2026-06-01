"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Timer } from "lucide-react";
import { formatDurationSeconds } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

export type EntryTimerProps = {
  onDurationChange?: (seconds: number) => void;
  className?: string;
};

export function EntryTimer({ onDurationChange, className }: EntryTimerProps) {
  const t = useTranslations("stockEntry");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  useEffect(() => {
    onDurationChange?.(seconds);
  }, [seconds, onDurationChange]);

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border bg-primary/5 px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Timer className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">{t("entryTimer")}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-lg font-bold text-primary">
          {formatDurationSeconds(seconds)}
        </span>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          {running ? t("pause") : t("resume")}
        </button>
      </div>
    </div>
  );
}
