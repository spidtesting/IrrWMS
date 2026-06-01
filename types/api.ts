export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedResponse<T> = ApiSuccessResponse<T[]> & {
  meta: PaginationMeta;
};

export type SortDirection = "asc" | "desc";

export type SortState = {
  field: string;
  direction: SortDirection;
};

export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "in"
  | "between";

export type FilterCondition = {
  field: string;
  operator: FilterOperator;
  value: unknown;
};

export type FilterState = {
  search?: string;
  filters?: FilterCondition[];
  sort?: SortState;
};

export type PaginationParams = {
  page: number;
  limit: number;
  skip: number;
};
