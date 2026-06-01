import {
  REDIS_NOTIFICATION_CHANNEL,
  type NotificationBroadcastPayload,
  SOCKET_EVENTS,
} from "@/server/lib/events";
import { getRedisPubClient } from "@/server/lib/redis-clients";
import { logger } from "@/lib/logger";

export async function broadcastToRoom(
  room: string,
  event: NotificationBroadcastPayload["event"],
  payload: Record<string, unknown>,
): Promise<void> {
  const message: NotificationBroadcastPayload = { event, room, payload };

  try {
    const client = getRedisPubClient();
    if (client.status !== "ready") {
      await client.connect();
    }
    await client.publish(REDIS_NOTIFICATION_CHANNEL, JSON.stringify(message));
  } catch (error) {
    logger.error({ err: error, room, event }, "Failed to publish socket broadcast");
  }
}

export async function notifyUser(userId: string, payload: Record<string, unknown>): Promise<void> {
  await broadcastToRoom(`user:${userId}`, SOCKET_EVENTS.NOTIFICATION_NEW, payload);
}

export async function notifyWarehouse(
  warehouseId: string,
  payload: Record<string, unknown>,
): Promise<void> {
  await broadcastToRoom(`warehouse:${warehouseId}`, SOCKET_EVENTS.NOTIFICATION_NEW, payload);
}
