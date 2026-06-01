export const queryKeys = {
  all: ["irrwms"] as const,

  auth: {
    all: () => [...queryKeys.all, "auth"] as const,
    session: () => [...queryKeys.auth.all(), "session"] as const,
    profile: (userId: string) => [...queryKeys.auth.all(), "profile", userId] as const,
  },

  users: {
    all: () => [...queryKeys.all, "users"] as const,
    lists: () => [...queryKeys.users.all(), "list"] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all(), "detail"] as const,
    detail: (userId: string) => [...queryKeys.users.details(), userId] as const,
  },

  warehouses: {
    all: () => [...queryKeys.all, "warehouses"] as const,
    lists: () => [...queryKeys.warehouses.all(), "list"] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.warehouses.lists(), filters] as const,
    details: () => [...queryKeys.warehouses.all(), "detail"] as const,
    detail: (warehouseId: string) => [...queryKeys.warehouses.details(), warehouseId] as const,
    zones: (warehouseId: string) => [...queryKeys.warehouses.detail(warehouseId), "zones"] as const,
    stats: (warehouseId: string) => [...queryKeys.warehouses.detail(warehouseId), "stats"] as const,
  },

  products: {
    all: () => [...queryKeys.all, "products"] as const,
    lists: () => [...queryKeys.products.all(), "list"] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all(), "detail"] as const,
    detail: (productId: string) => [...queryKeys.products.details(), productId] as const,
    bySku: (sku: string) => [...queryKeys.products.all(), "sku", sku] as const,
  },

  inventory: {
    all: () => [...queryKeys.all, "inventory"] as const,
    lists: () => [...queryKeys.inventory.all(), "list"] as const,
    list: (warehouseId: string, filters: Record<string, unknown>) =>
      [...queryKeys.inventory.lists(), warehouseId, filters] as const,
    detail: (productId: string, warehouseId: string) =>
      [...queryKeys.inventory.all(), productId, warehouseId] as const,
    snapshots: (warehouseId: string) =>
      [...queryKeys.inventory.all(), "snapshots", warehouseId] as const,
    lowStock: (warehouseId: string) =>
      [...queryKeys.inventory.all(), "low-stock", warehouseId] as const,
  },

  orders: {
    all: () => [...queryKeys.all, "orders"] as const,
    lists: () => [...queryKeys.orders.all(), "list"] as const,
    list: (warehouseId: string, filters: Record<string, unknown>) =>
      [...queryKeys.orders.lists(), warehouseId, filters] as const,
    details: () => [...queryKeys.orders.all(), "detail"] as const,
    detail: (orderId: string) => [...queryKeys.orders.details(), orderId] as const,
    timeline: (orderId: string) => [...queryKeys.orders.detail(orderId), "timeline"] as const,
  },

  inbound: {
    all: () => [...queryKeys.all, "inbound"] as const,
    lists: () => [...queryKeys.inbound.all(), "list"] as const,
    list: (warehouseId: string, filters: Record<string, unknown>) =>
      [...queryKeys.inbound.lists(), warehouseId, filters] as const,
    detail: (shipmentId: string) => [...queryKeys.inbound.all(), "detail", shipmentId] as const,
  },

  outbound: {
    all: () => [...queryKeys.all, "outbound"] as const,
    lists: () => [...queryKeys.outbound.all(), "list"] as const,
    list: (warehouseId: string, filters: Record<string, unknown>) =>
      [...queryKeys.outbound.lists(), warehouseId, filters] as const,
    detail: (shipmentId: string) => [...queryKeys.outbound.all(), "detail", shipmentId] as const,
  },

  pickLists: {
    all: () => [...queryKeys.all, "pick-lists"] as const,
    lists: () => [...queryKeys.pickLists.all(), "list"] as const,
    list: (warehouseId: string, filters: Record<string, unknown>) =>
      [...queryKeys.pickLists.lists(), warehouseId, filters] as const,
    detail: (pickListId: string) => [...queryKeys.pickLists.all(), "detail", pickListId] as const,
  },

  packSessions: {
    all: () => [...queryKeys.all, "pack-sessions"] as const,
    detail: (sessionId: string) => [...queryKeys.packSessions.all(), "detail", sessionId] as const,
  },

  dashboard: {
    all: () => [...queryKeys.all, "dashboard"] as const,
    kpis: (warehouseId: string, period: string) =>
      [...queryKeys.dashboard.all(), "kpis", warehouseId, period] as const,
    activity: (warehouseId: string) =>
      [...queryKeys.dashboard.all(), "activity", warehouseId] as const,
  },

  reports: {
    all: () => [...queryKeys.all, "reports"] as const,
    detail: (reportType: string, warehouseId: string, range: string) =>
      [...queryKeys.reports.all(), reportType, warehouseId, range] as const,
  },

  auditLogs: {
    all: () => [...queryKeys.all, "audit-logs"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.auditLogs.all(), "list", filters] as const,
  },

  notifications: {
    all: () => [...queryKeys.all, "notifications"] as const,
    list: (userId: string) => [...queryKeys.notifications.all(), "list", userId] as const,
    unreadCount: (userId: string) =>
      [...queryKeys.notifications.all(), "unread-count", userId] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
