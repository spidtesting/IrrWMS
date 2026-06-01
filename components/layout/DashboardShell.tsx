"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { LocaleSync } from "@/components/layout/LocaleSync";

type DashboardShellProps = {
  children: React.ReactNode;
  warehouseNameEn: string;
  warehouseNameSi: string;
};

export function DashboardShell({
  children,
  warehouseNameEn,
  warehouseNameSi,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <LocaleSync />
      <Sidebar warehouseNameEn={warehouseNameEn} warehouseNameSi={warehouseNameSi} />
      <MobileNav warehouseNameEn={warehouseNameEn} warehouseNameSi={warehouseNameSi} />
      <CommandPalette />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main id="main-content" className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
