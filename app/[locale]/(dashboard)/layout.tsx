import type { Metadata } from "next";
import { DashboardMobileNav } from "@/components/dashboard/DashboardMobileNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | IrrWMS",
    template: "%s | IrrWMS",
  },
  description: "Irrigation Department Warehouse Management System",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <DashboardSidebar />
      <DashboardMobileNav />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
