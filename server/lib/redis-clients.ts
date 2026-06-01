import Redis from "ioredis";
import { logger } from "@/lib/logger";

let pubClient: Redis | null = null;
let subClient: Redis | null = null;

function getRedisUrl(): string {
  return process.env.REDIS_URL ?? "redis://localhost:6379";
}

export function getRedisPubClient(): Redis {
  if (!pubClient) {
    pubClient = new Redis(getRedisUrl(), {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });

    pubClient.on("error", (err) => {
      logger.error({ err }, "Redis pub client error");
    });
  }

  return pubClient;
}

export function getRedisSubClient(): Redis {
  if (!subClient) {
    subClient = new Redis(getRedisUrl(), {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });

    subClient.on("error", (err) => {
      logger.error({ err }, "Redis sub client error");
    });
  }

  return subClient;
}

export async function publishBroadcast(message: string): Promise<void> {
  const client = getRedisPubClient();
  if (client.status !== "ready") {
    await client.connect();
  }
  await client.publish("irrwms:socket:broadcast", message);
}

export async function disconnectRedisClients(): Promise<void> {
  const clients = [pubClient, subClient].filter(Boolean) as Redis[];
  await Promise.all(clients.map((c) => c.quit()));
  pubClient = null;
  subClient = null;
}
