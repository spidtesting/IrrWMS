import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { AppProviders } from "@/providers";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GlobalToaster } from "@/components/shared/GlobalToaster";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | IrrWMS",
    template: "%s | IrrWMS",
  },
  description: "Irrigation Department Warehouse Management System",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <AppProviders>
      <NextIntlClientProvider messages={messages}>
        <div className="min-h-screen bg-background">
          <DashboardSidebar />
          <DashboardShell>{children}</DashboardShell>
          <GlobalToaster />
        </div>
      </NextIntlClientProvider>
    </AppProviders>
  );
}
