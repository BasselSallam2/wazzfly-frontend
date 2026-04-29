import { env } from '@/config/env';

let initialized = false;

interface SentryLike {
  init: (opts: Record<string, unknown>) => void;
}

export async function initSentry(): Promise<void> {
  if (initialized || !env.VITE_SENTRY_DSN) return;
  initialized = true;
  try {
    const moduleSpecifier = '@sentry/react';
    const dynamicImport = new Function('s', 'return import(s)') as (
      s: string,
    ) => Promise<unknown>;
    const mod = (await dynamicImport(moduleSpecifier).catch(() => null)) as
      | SentryLike
      | null;
    if (!mod || typeof mod.init !== 'function') {
      console.warn('[sentry] @sentry/react is not installed; skipping init');
      return;
    }
    mod.init({
      dsn: env.VITE_SENTRY_DSN,
      tracesSampleRate: 0.1,
      environment: import.meta.env.MODE,
    });
  } catch (err) {
    console.warn('[sentry] Failed to initialise', err);
  }
}
