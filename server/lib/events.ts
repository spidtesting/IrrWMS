/** Socket.io event names shared between server, worker, and client. */
export const SOCKET_EVENTS = {
  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_READ: "notification:read",
  NOTIFICATION_COUNT: "notification:count",
  STOCK_UPDATED: "stock:updated",
  STOCK_LOW: "stock:low",
  KPI_ALERT: "kpi:alert",
  TASK_DUE: "task:due",
  TASK_UPDATED: "task:updated",
  APPROVAL_NEEDED: "approval:needed",
  REPORT_READY: "report:ready",
  PING: "ping",
  PONG: "pong",
} as const;

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

/** Redis pub/sub channel for cross-process notification fan-out. */
export const REDIS_NOTIFICATION_CHANNEL = "irrwms:socket:broadcast";

export type NotificationBroadcastPayload = {
  event: SocketEventName;
  room: string;
  payload: Record<string, unknown>;
};
