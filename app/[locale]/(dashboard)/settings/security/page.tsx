"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Shield, Key } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useSecuritySettings } from "@/hooks/api/use-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatRelativeTime } from "@/lib/utils/formatters";

export default function SecuritySettingsPage() {
  const t = useTranslations("settings");
  const { data: security, isLoading } = useSecuritySettings();

  if (isLoading) return <LoadingSkeleton rows={3} columns={1} />;

  return (
    <div>
      <PageHeader
        title={t("security")}
        breadcrumbs={[{ label: t("title"), href: "/settings" }, { label: t("security") }]}
        action={
          <Button variant="outline" asChild>
            <Link href="/settings">{t("back")}</Link>
          </Button>
        }
      />

      <div className="grid max-w-xl gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t("accountSecurity")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("twoFactor")}</span>
              <span className="font-medium">
                {security?.twoFactorEnabled ? t("enabled") : t("disabled")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("lastPasswordChange")}</span>
              <span>
                {security?.lastPasswordChange
                  ? formatRelativeTime(security.lastPasswordChange)
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("activeSessions")}</span>
              <span className="font-medium">{security?.activeSessions ?? 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              {t("password")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/forgot-password">{t("changePassword")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
