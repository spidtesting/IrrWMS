import type { ApiErrorResponse, ApiSuccessResponse, PaginatedResponse } from "@/types/api";

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

type QueryParams = Record<string, string | number | boolean | undefined | null>;

type RequestOptions = {
  method?: string;
  body?: unknown;
  params?: QueryParams;
  headers?: HeadersInit;
};

function buildUrl(path: string, params?: QueryParams): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(
    `/api/v1${normalized}`,
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  );

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.pathname + url.search;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse
    | PaginatedResponse<T>;

  if (!response.ok || !json.success) {
    const errorBody = json as ApiErrorResponse;
    throw new ApiError(
      errorBody.error?.code ?? "REQUEST_FAILED",
      errorBody.error?.message ?? "Request failed",
      response.status,
    );
  }

  return json as T;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(buildUrl(path, options.params), {
    method: options.method ?? "GET",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await parseResponse<ApiSuccessResponse<T>>(response);
  return json.data;
}

async function requestPaginated<T>(
  path: string,
  params?: QueryParams,
): Promise<PaginatedResponse<T>> {
  const response = await fetch(buildUrl(path, params));
  return parseResponse<PaginatedResponse<T>>(response);
}

export const api = {
  get: <T>(path: string, params?: QueryParams) => request<T>(path, { params }),

  post: <T>(path: string, body?: unknown, params?: QueryParams) =>
    request<T>(path, { method: "POST", body, params }),

  put: <T>(path: string, body?: unknown, params?: QueryParams) =>
    request<T>(path, { method: "PUT", body, params }),

  patch: <T>(path: string, body?: unknown, params?: QueryParams) =>
    request<T>(path, { method: "PATCH", body, params }),

  delete: <T>(path: string, params?: QueryParams) => request<T>(path, { method: "DELETE", params }),

  getPaginated: <T>(path: string, params?: QueryParams) => requestPaginated<T>(path, params),
};
