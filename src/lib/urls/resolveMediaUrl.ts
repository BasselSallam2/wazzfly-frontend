import { env } from '@/config/env';

/**
 * If the API returns a relative file path, prefix the API origin (strip `/api`).
 * Absolute `http(s)://` URLs are returned as-is.
 */
export function resolveMediaUrl(path: string | null | undefined): string | undefined {
  if (path == null || path === '') return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = env.VITE_API_BASE_URL.replace(/\/api\/?$/, '');
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}
