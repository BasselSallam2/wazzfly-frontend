export function formatNumber(value: number | null | undefined): string {
  return new Intl.NumberFormat('en-US').format(typeof value === 'number' ? value : 0);
}

export function formatCompactNumber(value: number | null | undefined): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(typeof value === 'number' ? value : 0);
}

export function formatPercent(value: number | null | undefined, fractionDigits = 1): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(typeof value === 'number' ? value / 100 : 0);
}
