"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { DashboardHeader } from "./DashboardHeader";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const isCollapsed = useAppStore((s) => s.isCollapsed);

  return (
    <div className={cn("transition-all duration-300", isCollapsed ? "ml-16" : "ml-64")}>
      <DashboardHeader />
      <main className="p-6">{children}</main>
    </div>
  );
}
