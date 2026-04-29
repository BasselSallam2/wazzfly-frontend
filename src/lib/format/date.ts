import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export function formatDate(input?: string | Date | null): string {
  if (!input) return '—';
  return dayjs(input).format('MMM DD, YYYY');
}

export function formatDateTime(input?: string | Date | null): string {
  if (!input) return '—';
  return dayjs(input).format('MMM DD, YYYY HH:mm');
}

export function formatRelative(input?: string | Date | null): string {
  if (!input) return '—';
  return dayjs(input).fromNow();
}

export { dayjs };
