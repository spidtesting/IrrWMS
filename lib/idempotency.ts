import { env } from "@/config/env";
import { getCache, setCache } from "@/lib/cache";
import { ConflictError } from "@/lib/error-handler";
import { logger } from "@/lib/logger";

const IDEMPOTENCY_PREFIX = "idempotency";

export type IdempotencyRecord<T = unknown> = {
  key: string;
  status: "processing" | "completed";
  response?: T;
  createdAt: string;
  completedAt?: string;
};

export type IdempotencyCheckResult<T> =
  | { state: "new" }
  | { state: "processing" }
  | { state: "completed"; response: T };

function buildIdempotencyKey(key: string): string {
  return `${IDEMPOTENCY_PREFIX}:${key}`;
}

export async function checkIdempotency<T>(key: string): Promise<IdempotencyCheckResult<T>> {
  const cacheKey = buildIdempotencyKey(key);
  const record = await getCache<IdempotencyRecord<T>>(cacheKey);

  if (!record) {
    return { state: "new" };
  }

  if (record.status === "processing") {
    return { state: "processing" };
  }

  if (record.status === "completed" && record.response !== undefined) {
    return { state: "completed", response: record.response };
  }

  return { state: "new" };
}

export async function storeIdempotency<T>(
  key: string,
  value: IdempotencyRecord<T>,
  ttlSeconds: number = env.IDEMPOTENCY_TTL_SECONDS,
): Promise<void> {
  const cacheKey = buildIdempotencyKey(key);
  await setCache(cacheKey, value, ttlSeconds);
}

export async function beginIdempotency(key: string): Promise<void> {
  const existing = await checkIdempotency(key);

  if (existing.state === "processing") {
    throw new ConflictError("Request is already being processed");
  }

  if (existing.state === "completed") {
    throw new ConflictError("Duplicate idempotency key");
  }

  await storeIdempotency(key, {
    key,
    status: "processing",
    createdAt: new Date().toISOString(),
  });
}

export async function completeIdempotency<T>(
  key: string,
  response: T,
  ttlSeconds: number = env.IDEMPOTENCY_TTL_SECONDS,
): Promise<void> {
  await storeIdempotency(
    key,
    {
      key,
      status: "completed",
      response,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
    ttlSeconds,
  );
}

export async function failIdempotency(key: string): Promise<void> {
  const cacheKey = buildIdempotencyKey(key);

  try {
    const { invalidateCache } = await import("@/lib/cache");
    await invalidateCache(cacheKey);
  } catch (error) {
    logger.warn({ err: error, key }, "Failed to clear idempotency key");
  }
}

export function getIdempotencyKeyFromRequest(request: Request): string | null {
  return request.headers.get("idempotency-key") ?? request.headers.get("x-idempotency-key");
}
