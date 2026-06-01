import { NextResponse } from "next/server";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationMeta,
} from "@/types/api";

export function successResponse<T>(
  data: T,
  options?: {
    message?: string;
    meta?: Record<string, unknown>;
    status?: number;
    headers?: HeadersInit;
  },
): NextResponse<ApiSuccessResponse<T>> {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(options?.message ? { message: options.message } : {}),
    ...(options?.meta ? { meta: options.meta } : {}),
  };

  return NextResponse.json(body, {
    status: options?.status ?? 200,
    headers: options?.headers,
  });
}

export function errorResponse(
  code: string,
  message: string,
  options?: {
    status?: number;
    details?: unknown;
    headers?: HeadersInit;
  },
): NextResponse<ApiErrorResponse> {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(options?.details !== undefined ? { details: options.details } : {}),
    },
  };

  return NextResponse.json(body, {
    status: options?.status ?? 400,
    headers: options?.headers,
  });
}

export function paginatedResponse<T>(
  data: T[],
  pagination: PaginationMeta,
  options?: {
    message?: string;
    status?: number;
    headers?: HeadersInit;
  },
): NextResponse<PaginatedResponse<T>> {
  const body: PaginatedResponse<T> = {
    success: true,
    data,
    meta: pagination,
    ...(options?.message ? { message: options.message } : {}),
  };

  return NextResponse.json(body, {
    status: options?.status ?? 200,
    headers: options?.headers,
  });
}

export type { ApiResponse } from "@/types/api";
