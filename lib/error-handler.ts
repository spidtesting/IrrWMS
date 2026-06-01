import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { errorResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: unknown;
  readonly isOperational: boolean;

  constructor(
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      details?: unknown;
      isOperational?: boolean;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options?.cause });
    this.name = this.constructor.name;
    this.code = options?.code ?? "INTERNAL_ERROR";
    this.statusCode = options?.statusCode ?? 500;
    this.details = options?.details;
    this.isOperational = options?.isOperational ?? true;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, {
      code: "VALIDATION_ERROR",
      statusCode: 422,
      details,
    });
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(message, {
      code: "UNAUTHORIZED",
      statusCode: 401,
      details,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: unknown) {
    super(message, {
      code: "FORBIDDEN",
      statusCode: 403,
      details,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details?: unknown) {
    super(message, {
      code: "NOT_FOUND",
      statusCode: 404,
      details,
    });
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict", details?: unknown) {
    super(message, {
      code: "CONFLICT",
      statusCode: 409,
      details,
    });
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests", details?: unknown) {
    super(message, {
      code: "RATE_LIMITED",
      statusCode: 429,
      details,
    });
  }
}

function formatZodError(error: ZodError): unknown {
  return error.flatten();
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    if (!error.isOperational || error.statusCode >= 500) {
      logger.error({ err: error, code: error.code, details: error.details }, error.message);
    } else {
      logger.warn({ code: error.code, details: error.details }, error.message);
    }

    return errorResponse(error.code, error.message, {
      status: error.statusCode,
      details: error.details,
    });
  }

  if (error instanceof ZodError) {
    logger.warn({ err: error.flatten() }, "Request validation failed");
    return errorResponse("VALIDATION_ERROR", "Validation failed", {
      status: 422,
      details: formatZodError(error),
    });
  }

  logger.error({ err: error }, "Unhandled API error");

  return errorResponse("INTERNAL_ERROR", "An unexpected error occurred. Please try again later.", {
    status: 500,
  });
}

export function assertCondition(condition: unknown, error: AppError): asserts condition {
  if (!condition) {
    throw error;
  }
}
