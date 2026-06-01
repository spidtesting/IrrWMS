import { Redis as UpstashRedis } from "@upstash/redis";
import { env, hasRedisUrl, hasUpstashRedis } from "@/config/env";
import { logger } from "@/lib/logger";

export type RedisClient = {
  get: (key: string) => Promise<string | null>;
  set: (
    key: string,
    value: string,
    options?: { ex?: number; px?: number; nx?: boolean },
  ) => Promise<string | null>;
  del: (...keys: string[]) => Promise<number>;
  exists: (...keys: string[]) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<number>;
  ttl: (key: string) => Promise<number>;
  incr: (key: string) => Promise<number>;
  decr: (key: string) => Promise<number>;
  ping: () => Promise<string>;
};

type IORedisLike = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, ...args: Array<string | number>) => Promise<string | null>;
  connect: () => Promise<void>;
  del: (...keys: string[]) => Promise<number>;
  exists: (...keys: string[]) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<number>;
  ttl: (key: string) => Promise<number>;
  incr: (key: string) => Promise<number>;
  decr: (key: string) => Promise<number>;
  ping: () => Promise<string>;
  quit: () => Promise<string>;
  on: (event: string, listener: (...args: unknown[]) => void) => void;
};

function wrapUpstashClient(client: UpstashRedis): RedisClient {
  return {
    get: async (key) => {
      const value = await client.get<string>(key);
      return value ?? null;
    },
    set: async (key, value, options) => {
      if (options?.nx && options.ex !== undefined) {
        const result = await client.set(key, value, { ex: options.ex, nx: true });
        return result === "OK" ? "OK" : null;
      }

      if (options?.nx && options.px !== undefined) {
        const result = await client.set(key, value, { px: options.px, nx: true });
        return result === "OK" ? "OK" : null;
      }

      if (options?.nx) {
        const result = await client.set(key, value, { nx: true });
        return result === "OK" ? "OK" : null;
      }

      if (options?.ex !== undefined) {
        await client.set(key, value, { ex: options.ex });
        return "OK";
      }

      if (options?.px !== undefined) {
        await client.set(key, value, { px: options.px });
        return "OK";
      }

      await client.set(key, value);
      return "OK";
    },
    del: async (...keys) => client.del(...keys),
    exists: async (...keys) => client.exists(...keys),
    expire: async (key, seconds) => client.expire(key, seconds),
    ttl: async (key) => client.ttl(key),
    incr: async (key) => client.incr(key),
    decr: async (key) => client.decr(key),
    ping: async () => {
      const result = await client.ping();
      return typeof result === "string" ? result : "PONG";
    },
  };
}

function wrapIoRedisClient(client: IORedisLike): RedisClient {
  return {
    get: (key) => client.get(key),
    set: async (key, value, options) => {
      if (options?.nx && options.ex !== undefined) {
        return client.set(key, value, "EX", options.ex, "NX");
      }

      if (options?.nx && options.px !== undefined) {
        return client.set(key, value, "PX", options.px, "NX");
      }

      if (options?.nx) {
        return client.set(key, value, "NX");
      }

      if (options?.ex !== undefined) {
        await client.set(key, value, "EX", options.ex);
        return "OK";
      }

      if (options?.px !== undefined) {
        await client.set(key, value, "PX", options.px);
        return "OK";
      }

      await client.set(key, value);
      return "OK";
    },
    del: (...keys) => client.del(...keys),
    exists: (...keys) => client.exists(...keys),
    expire: (key, seconds) => client.expire(key, seconds),
    ttl: (key) => client.ttl(key),
    incr: (key) => client.incr(key),
    decr: (key) => client.decr(key),
    ping: () => client.ping(),
  };
}

async function createIoRedisClient(): Promise<IORedisLike> {
  if (!env.REDIS_URL) {
    throw new Error("REDIS_URL is required for ioredis-style Redis connection.");
  }

  const { default: IORedis } = await import("ioredis");

  const client = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    enableReadyCheck: true,
  });

  client.on("error", (error: Error) => {
    logger.error({ err: error }, "Redis connection error");
  });

  await client.connect();
  return client as unknown as IORedisLike;
}

let redisClientPromise: Promise<RedisClient> | null = null;

async function initializeRedisClient(): Promise<RedisClient> {
  if (hasUpstashRedis()) {
    logger.info("Initializing Upstash Redis client");
    const client = new UpstashRedis({
      url: env.UPSTASH_REDIS_REST_URL!,
      token: env.UPSTASH_REDIS_REST_TOKEN!,
    });
    return wrapUpstashClient(client);
  }

  if (hasRedisUrl()) {
    logger.info("Initializing ioredis-style Redis client from REDIS_URL");
    const client = await createIoRedisClient();
    return wrapIoRedisClient(client);
  }

  throw new Error("No Redis configuration found. Set UPSTASH_REDIS_REST_URL/TOKEN or REDIS_URL.");
}

export async function getRedisClient(): Promise<RedisClient> {
  if (!redisClientPromise) {
    redisClientPromise = initializeRedisClient();
  }

  return redisClientPromise;
}

export async function pingRedis(): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const response = await client.ping();
    return response.toUpperCase() === "PONG";
  } catch (error) {
    logger.error({ err: error }, "Redis ping failed");
    return false;
  }
}

export default getRedisClient;
