"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/api/use-notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  const { language } = useLanguage();
  const { data, isLoading } = useNotifications({ limit: 50 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
        action={
          <Button
            variant="outline"
            onClick={() =>
              markAllRead.mutate(undefined, {
                onSuccess: () => toast.success(t("allMarkedRead")),
              })
            }
            disabled={markAllRead.isPending}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            {t("markAllRead")}
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSkeleton rows={5} columns={1} />
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-muted-foreground">
          <Bell className="mb-4 h-12 w-12 opacity-50" />
          <p>{t("empty")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn("transition-colors", !n.isRead && "border-primary/30 bg-primary/5")}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{language === "si" ? n.titleSi : n.titleEn}</p>
                    <StatusBadge status={n.type} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatRelativeTime(n.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {n.link && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={n.link}>{t("view")}</Link>
                    </Button>
                  )}
                  {!n.isRead && (
                    <Button variant="ghost" size="sm" onClick={() => markRead.mutate(n.id)}>
                      {t("markRead")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
