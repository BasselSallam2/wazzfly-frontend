import { env } from '@/config/env';

export function formatCurrency(
  amount: number | null | undefined,
  options: { currency?: string; signDisplay?: 'auto' | 'always' | 'never' } = {},
): string {
  const value = typeof amount === 'number' ? amount : 0;
  const currency = options.currency ?? env.VITE_DEFAULT_CURRENCY ?? 'USD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: options.signDisplay ?? 'auto',
  }).format(value);
}

export function formatCompactCurrency(amount: number | null | undefined): string {
  const value = typeof amount === 'number' ? amount : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: env.VITE_DEFAULT_CURRENCY ?? 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}
