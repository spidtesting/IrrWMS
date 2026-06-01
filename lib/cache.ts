import { getRedisClient } from "@/lib/redis";
import { logger } from "@/lib/logger";

export const CACHE_TTL = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 3600,
  DAY: 86_400,
  WEEK: 604_800,
} as const;

export type CacheTTL = (typeof CACHE_TTL)[keyof typeof CACHE_TTL] | number;

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const redis = await getRedisClient();
    const raw = await redis.get(key);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as T;
  } catch (error) {
    logger.warn({ err: error, key }, "Cache get failed");
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: CacheTTL = CACHE_TTL.MEDIUM,
): Promise<boolean> {
  try {
    const redis = await getRedisClient();
    await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
    return true;
  } catch (error) {
    logger.warn({ err: error, key }, "Cache set failed");
    return false;
  }
}

export async function invalidateCache(...keys: string[]): Promise<number> {
  if (keys.length === 0) {
    return 0;
  }

  try {
    const redis = await getRedisClient();
    return await redis.del(...keys);
  } catch (error) {
    logger.warn({ err: error, keys }, "Cache invalidation failed");
    return 0;
  }
}

export async function getOrSetCache<T>(
  key: string,
  factory: () => Promise<T>,
  ttlSeconds: CacheTTL = CACHE_TTL.MEDIUM,
): Promise<T> {
  const cached = await getCache<T>(key);

  if (cached !== null) {
    return cached;
  }

  const value = await factory();
  await setCache(key, value, ttlSeconds);
  return value;
}

export async function cacheExists(key: string): Promise<boolean> {
  try {
    const redis = await getRedisClient();
    const count = await redis.exists(key);
    return count > 0;
  } catch (error) {
    logger.warn({ err: error, key }, "Cache exists check failed");
    return false;
  }
}

export async function getCacheTTL(key: string): Promise<number> {
  try {
    const redis = await getRedisClient();
    return await redis.ttl(key);
  } catch (error) {
    logger.warn({ err: error, key }, "Cache TTL lookup failed");
    return -1;
  }
}
