"use client";

import { useTranslations } from "next-intl";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DashboardRecentEntry } from "@/types/dashboard";
import { formatDateTime, formatQuantity } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

type RecentActivityProps = {
  entries: DashboardRecentEntry[];
};

const INBOUND_TYPES = new Set(["GOODS_RECEIVED", "TRANSFER_IN", "GOODS_RETURNED"]);

export function RecentActivity({ entries }: RecentActivityProps) {
  const t = useTranslations("dashboard.recentActivity");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {entries.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <ScrollArea className="h-[320px]">
            <ul className="divide-y">
              {entries.map((entry) => {
                const isInbound = INBOUND_TYPES.has(entry.type);
                return (
                  <li key={entry.id} className="flex items-start gap-3 px-6 py-3 hover:bg-muted/40">
                    <div
                      className={cn(
                        "mt-0.5 rounded-full p-1.5",
                        isInbound
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/20 text-secondary-foreground",
                      )}
                    >
                      {isInbound ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{entry.entryNumber}</p>
                        <StatusBadge status={entry.status} />
                      </div>
                      <BilingualLabel
                        en={entry.itemNameEn}
                        si={entry.itemNameSi}
                        primary="en"
                        className="text-xs"
                      />
                      <p className="text-xs text-muted-foreground">
                        {formatQuantity(entry.quantity)} · {formatDateTime(entry.createdAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
