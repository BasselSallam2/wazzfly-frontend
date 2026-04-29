import type { ListQuery, PopulateSpec } from '@/types';

function flattenFilters(filters: Record<string, unknown> | undefined, params: Record<string, string>) {
  if (!filters) return;
  for (const [key, raw] of Object.entries(filters)) {
    if (raw === undefined || raw === null || raw === '') continue;
    if (typeof raw === 'object' && !Array.isArray(raw)) {
      for (const [op, value] of Object.entries(raw as Record<string, unknown>)) {
        if (value === undefined || value === null || value === '') continue;
        params[`${key}[${op}]`] = String(value);
      }
    } else if (Array.isArray(raw)) {
      params[key] = raw.join(',');
    } else if (typeof raw === 'boolean') {
      params[key] = raw ? 'true' : 'false';
    } else {
      params[key] = String(raw);
    }
  }
}

export function buildQuery<TFilter = Record<string, unknown>>(
  query: ListQuery<TFilter> | undefined,
): Record<string, string> {
  if (!query) return {};
  const params: Record<string, string> = {};

  if (query.limit !== undefined) params.limit = String(query.limit);
  if (query.page !== undefined) params.page = String(query.page);
  if (query.fields?.length) params.fields = query.fields.join(',');
  if (query.populate?.length) params.populate = JSON.stringify(query.populate);
  if (query.searchBy) params.searchBy = query.searchBy;
  if (query.keyword) params.keyword = query.keyword;
  if (query.sort) params.sort = query.sort;
  if (query.cache !== undefined) params.cache = query.cache ? 'true' : 'false';

  flattenFilters(query.filters as Record<string, unknown> | undefined, params);

  return params;
}

export function buildPopulate(specs: PopulateSpec[]): string {
  return JSON.stringify(specs);
}
