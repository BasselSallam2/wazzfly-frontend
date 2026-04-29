import { AxiosError } from 'axios';
import type { ApiErrorBody } from '@/types';

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: number;
  public readonly fields?: Array<{ path?: string; message?: string; field?: string }>;
  public readonly raw?: unknown;

  constructor(message: string, options: { status: number; code?: number; fields?: ApiError['fields']; raw?: unknown }) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.fields = options.fields;
    this.raw = options.raw;
  }
}

export function normalizeAxiosError(err: unknown): ApiError {
  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 0;
    const data = (err.response?.data ?? {}) as ApiErrorBody;
    const message = data.message ?? err.message ?? 'Network error';
    return new ApiError(message, {
      status,
      code: data.code,
      fields: data.errors,
      raw: data,
    });
  }
  if (err instanceof Error) {
    return new ApiError(err.message, { status: 0 });
  }
  return new ApiError('Unknown error', { status: 0 });
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}
