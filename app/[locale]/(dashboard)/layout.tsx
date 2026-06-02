import type { Metadata } from "next";
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
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
