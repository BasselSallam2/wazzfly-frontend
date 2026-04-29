export function shortId(id: string | null | undefined, length = 6): string {
  if (!id) return '—';
  return id.slice(-length);
}
