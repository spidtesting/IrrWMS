import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Boxes,
  ClipboardCheck,
  ClipboardList,
  FileText,
  LayoutDashboard,
  PackageMinus,
  PackagePlus,
  ScrollText,
  Settings,
  Shield,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

export type DashboardNavItem = {
  href: string;
  labelKey: string;
  icon: LucideIcon;
};

export type DashboardNavGroup = {
  titleKey: string;
  items: DashboardNavItem[];
};

export const DASHBOARD_NAV_GROUPS: DashboardNavGroup[] = [
  {
    titleKey: "nav.overview",
    items: [
      { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
      { href: "/kpi", labelKey: "nav.kpi", icon: BarChart3 },
    ],
  },
  {
    titleKey: "nav.operations",
    items: [
      { href: "/inventory", labelKey: "nav.inventory", icon: Boxes },
      { href: "/goods-received", labelKey: "nav.goodsReceived", icon: PackagePlus },
      { href: "/goods-issued", labelKey: "nav.goodsIssued", icon: PackageMinus },
      { href: "/stock-entry", labelKey: "nav.stockEntry", icon: ClipboardList },
      { href: "/physical-count", labelKey: "nav.physicalCount", icon: ClipboardCheck },
      { href: "/damage-reports", labelKey: "nav.damageReports", icon: Shield },
    ],
  },
  {
    titleKey: "nav.procurement",
    items: [
      { href: "/purchase-orders", labelKey: "nav.purchaseOrders", icon: ShoppingCart },
      { href: "/suppliers", labelKey: "nav.suppliers", icon: Truck },
    ],
  },
  {
    titleKey: "nav.management",
    items: [
      { href: "/warehouse", labelKey: "nav.warehouse", icon: Warehouse },
      { href: "/staff", labelKey: "nav.staff", icon: Users },
      { href: "/reports", labelKey: "nav.reports", icon: FileText },
      { href: "/audit-logs", labelKey: "nav.auditLogs", icon: ScrollText },
    ],
  },
  {
    titleKey: "nav.system",
    items: [
      { href: "/notifications", labelKey: "nav.notifications", icon: Bell },
      { href: "/settings", labelKey: "nav.settings", icon: Settings },
    ],
  },
];
