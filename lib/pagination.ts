import type { PaginationMeta, PaginationParams } from "@/types/api";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export type ParsePaginationOptions = {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
};

export function parsePagination(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  options?: ParsePaginationOptions,
): PaginationParams {
  const defaultPage = options?.defaultPage ?? DEFAULT_PAGE;
  const defaultLimit = options?.defaultLimit ?? DEFAULT_LIMIT;
  const maxLimit = options?.maxLimit ?? MAX_LIMIT;

  const getParam = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) ?? undefined;
    }

    const value = searchParams[key];
    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  };

  const rawPage = Number.parseInt(getParam("page") ?? String(defaultPage), 10);
  const rawLimit = Number.parseInt(
    getParam("limit") ?? getParam("pageSize") ?? String(defaultLimit),
    10,
  );

  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : defaultPage;
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, maxLimit) : defaultLimit;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function buildPaginationMeta(
  total: number,
  params: Pick<PaginationParams, "page" | "limit">,
): PaginationMeta {
  const totalPages = total === 0 ? 0 : Math.ceil(total / params.limit);

  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPreviousPage: params.page > 1 && totalPages > 0,
  };
}

export { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT };
