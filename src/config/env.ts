import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000/api'),
  VITE_SOCKET_URL: z.string().default('http://localhost:3000'),
  VITE_SOCKET_PATH: z.string().default('/socket.io'),
  VITE_APP_NAME: z.string().default('Wazzfly Admin'),
  VITE_DEFAULT_CURRENCY: z.string().default('USD'),
  VITE_ENABLE_ADMIN_PROJECT_CREATE: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  VITE_NOTIFICATIONS_POLL_MS: z.coerce.number().default(30_000),
  VITE_DASHBOARD_REFRESH_MS: z.coerce.number().default(60_000),
  VITE_SENTRY_DSN: z.string().optional().default(''),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('[env] Invalid environment configuration', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;
export type Env = typeof env;
