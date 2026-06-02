"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { DashboardHeader } from "./DashboardHeader";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const isCollapsed = useAppStore((s) => s.isCollapsed);

  return (
    <div
      className={cn(
        "flex min-h-screen min-w-0 flex-col transition-[margin] duration-300",
        isCollapsed ? "lg:ml-16" : "lg:ml-64",
      )}
    >
      <DashboardHeader />
      <main className="min-w-0 flex-1 p-4 sm:p-5 lg:p-6">{children}</main>
    </div>
  );
}
