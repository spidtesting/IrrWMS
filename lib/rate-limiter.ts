import { Ratelimit } from "@upstash/ratelimit";
import { Redis as UpstashRedis } from "@upstash/redis";
import { env, hasUpstashRedis } from "@/config/env";
import { RateLimitError } from "@/lib/error-handler";
import { logger } from "@/lib/logger";

export type RateLimitConfig = {
  identifier: string;
  limit?: number;
  windowMs?: number;
  prefix?: string;
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

type MemoryBucket = {
  count: number;
  resetAt: number;
};

const memoryBuckets = new Map<string, MemoryBucket>();

const DEFAULT_LIMIT = 60;
const DEFAULT_WINDOW_MS = 60_000;

function createUpstashRatelimit(limit: number, windowMs: number, prefix: string): Ratelimit {
  const redis = new UpstashRedis({
    url: env.UPSTASH_REDIS_REST_URL!,
    token: env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000));

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    prefix,
    analytics: true,
  });
}

function checkMemoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    memoryBuckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: bucket.resetAt,
    };
  }

  bucket.count += 1;
  memoryBuckets.set(key, bucket);

  return {
    success: true,
    limit,
    remaining: limit - bucket.count,
    reset: bucket.resetAt,
  };
}

const ratelimitCache = new Map<string, Ratelimit>();

function getUpstashRatelimit(limit: number, windowMs: number, prefix: string): Ratelimit {
  const cacheKey = `${prefix}:${limit}:${windowMs}`;
  const existing = ratelimitCache.get(cacheKey);

  if (existing) {
    return existing;
  }

  const instance = createUpstashRatelimit(limit, windowMs, prefix);
  ratelimitCache.set(cacheKey, instance);
  return instance;
}

export async function rateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const limit = config.limit ?? DEFAULT_LIMIT;
  const windowMs = config.windowMs ?? DEFAULT_WINDOW_MS;
  const prefix = config.prefix ?? "irrwms:ratelimit";
  const key = `${prefix}:${config.identifier}`;

  try {
    if (hasUpstashRedis()) {
      const ratelimit = getUpstashRatelimit(limit, windowMs, prefix);
      const result = await ratelimit.limit(key);

      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    }

    return checkMemoryRateLimit(key, limit, windowMs);
  } catch (error) {
    logger.warn({ err: error, key }, "Rate limit check failed, allowing request");
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + windowMs,
    };
  }
}

export async function enforceRateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const result = await rateLimit(config);

  if (!result.success) {
    throw new RateLimitError("Too many requests", {
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    });
  }

  return result;
}

export function getRateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.reset),
  };
}

export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "anonymous";

  return `ip:${ip}`;
}
