import type { LucideIcon } from "lucide-react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  Shield,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";

export type NavItem = {
  key: string;
  href: string;
  icon: LucideIcon;
  labelKey: string;
  group?: "main" | "admin";
};

export const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    labelKey: "nav.dashboard",
    group: "main",
  },
  {
    key: "inventory",
    href: "/inventory",
    icon: Package,
    labelKey: "nav.inventory",
    group: "main",
  },
  {
    key: "inbound",
    href: "/inbound",
    icon: ArrowDownToLine,
    labelKey: "nav.inbound",
    group: "main",
  },
  {
    key: "outbound",
    href: "/outbound",
    icon: ArrowUpFromLine,
    labelKey: "nav.outbound",
    group: "main",
  },
  {
    key: "orders",
    href: "/orders",
    icon: ShoppingCart,
    labelKey: "nav.orders",
    group: "main",
  },
  {
    key: "warehouses",
    href: "/warehouses",
    icon: Warehouse,
    labelKey: "nav.warehouses",
    group: "admin",
  },
  {
    key: "users",
    href: "/users",
    icon: Users,
    labelKey: "nav.users",
    group: "admin",
  },
  {
    key: "reports",
    href: "/reports",
    icon: BarChart3,
    labelKey: "nav.reports",
    group: "admin",
  },
  {
    key: "settings",
    href: "/settings",
    icon: Settings,
    labelKey: "nav.settings",
    group: "admin",
  },
  {
    key: "audit-logs",
    href: "/audit-logs",
    icon: Shield,
    labelKey: "nav.auditLogs",
    group: "admin",
  },
];

export const COMMAND_NAV_ITEMS: NavItem[] = [
  ...NAV_ITEMS,
  {
    key: "tasks",
    href: "/tasks",
    icon: ClipboardList,
    labelKey: "nav.tasks",
    group: "main",
  },
];
