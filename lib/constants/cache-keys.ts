const CACHE_NAMESPACE = "irrwms";

function buildKey(...parts: Array<string | number | null | undefined>): string {
  return [CACHE_NAMESPACE, ...parts.filter(Boolean)].join(":");
}

export const cacheKeys = {
  user: (userId: string) => buildKey("user", userId),
  userPermissions: (userId: string) => buildKey("user", userId, "permissions"),
  userWarehouses: (userId: string) => buildKey("user", userId, "warehouses"),

  warehouse: (warehouseId: string) => buildKey("warehouse", warehouseId),
  warehouseStats: (warehouseId: string) => buildKey("warehouse", warehouseId, "stats"),
  warehouseZones: (warehouseId: string) => buildKey("warehouse", warehouseId, "zones"),

  product: (productId: string) => buildKey("product", productId),
  productBySku: (sku: string) => buildKey("product", "sku", sku),
  productInventory: (productId: string, warehouseId: string) =>
    buildKey("product", productId, "inventory", warehouseId),

  inventory: (warehouseId: string) => buildKey("inventory", warehouseId),
  inventorySnapshot: (warehouseId: string, date: string) =>
    buildKey("inventory", warehouseId, "snapshot", date),
  lowStockAlerts: (warehouseId: string) => buildKey("inventory", warehouseId, "low-stock"),

  order: (orderId: string) => buildKey("order", orderId),
  ordersList: (warehouseId: string, status: string, page: number) =>
    buildKey("orders", warehouseId, status, page),

  inboundShipment: (shipmentId: string) => buildKey("inbound", "shipment", shipmentId),
  outboundShipment: (shipmentId: string) => buildKey("outbound", "shipment", shipmentId),

  pickList: (pickListId: string) => buildKey("pick-list", pickListId),
  packSession: (sessionId: string) => buildKey("pack-session", sessionId),

  dashboardKpis: (warehouseId: string, period: string) =>
    buildKey("dashboard", warehouseId, "kpis", period),
  reports: (reportType: string, warehouseId: string, range: string) =>
    buildKey("reports", reportType, warehouseId, range),

  idempotency: (key: string) => buildKey("idempotency", key),
  rateLimit: (identifier: string) => buildKey("ratelimit", identifier),

  session: (sessionToken: string) => buildKey("session", sessionToken),
} as const;

export function invalidateWarehouseCacheKeys(warehouseId: string): string[] {
  return [
    cacheKeys.warehouse(warehouseId),
    cacheKeys.warehouseStats(warehouseId),
    cacheKeys.warehouseZones(warehouseId),
    cacheKeys.inventory(warehouseId),
    cacheKeys.lowStockAlerts(warehouseId),
  ];
}

export function invalidateProductCacheKeys(
  productId: string,
  sku: string,
  warehouseIds: string[] = [],
): string[] {
  const keys = [cacheKeys.product(productId), cacheKeys.productBySku(sku)];

  for (const warehouseId of warehouseIds) {
    keys.push(cacheKeys.productInventory(productId, warehouseId));
    keys.push(cacheKeys.inventory(warehouseId));
  }

  return keys;
}

export { buildKey as buildCacheKey };
