export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  status?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}

export interface ApiErrorBody {
  message?: string;
  status?: string;
  code?: number;
  errors?: Array<{ path?: string; message?: string; field?: string }>;
}

export interface PopulateSpec {
  path: string;
  select?: string;
  populate?: PopulateSpec[];
}

export type SortDirection = 'asc' | 'desc';

export interface ListQuery<TFilter = Record<string, unknown>> {
  limit?: number;
  page?: number;
  fields?: string[];
  populate?: PopulateSpec[];
  searchBy?: string;
  keyword?: string;
  sort?: string;
  cache?: boolean;
  filters?: TFilter;
}
