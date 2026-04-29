import type { BadgeProps } from '@components/ui/Badge';

export const projectStatusMap: Record<string, { label: string; tone: BadgeProps['tone'] }> = {
  open: { label: 'Open', tone: 'info' },
  'in-progress': { label: 'In progress', tone: 'warning' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
  rejected: { label: 'Rejected', tone: 'error' },
};

export const ticketStatusMap: Record<string, { label: string; tone: BadgeProps['tone'] }> = {
  pending: { label: 'Pending', tone: 'warning' },
  closed: { label: 'Closed', tone: 'neutral' },
};

export const ticketTypeMap: Record<string, { label: string; tone: BadgeProps['tone'] }> = {
  refund: { label: 'Refund', tone: 'info' },
  scam: { label: 'Scam', tone: 'error' },
};

export const userTypeMap: Record<string, { label: string; tone: BadgeProps['tone'] }> = {
  admin: { label: 'Admin', tone: 'primary' },
  client: { label: 'Client', tone: 'info' },
  freelancer: { label: 'Freelancer', tone: 'secondary' },
};

export const userStatusMap = (deleted?: boolean) =>
  deleted
    ? { label: 'Suspended', tone: 'error' as const }
    : { label: 'Active', tone: 'success' as const };

export const transactionTypeMap: Record<string, { label: string; tone: BadgeProps['tone'] }> = {
  charge: { label: 'Charge', tone: 'info' },
  transfer: { label: 'Transfer', tone: 'secondary' },
  Withdrawal: { label: 'Withdrawal', tone: 'warning' },
  refund: { label: 'Refund', tone: 'error' },
  credit: { label: 'Credit', tone: 'success' },
};

export const transactionStatusMap: Record<string, { label: string; tone: BadgeProps['tone'] }> = {
  pending: { label: 'Pending', tone: 'warning' },
  completed: { label: 'Completed', tone: 'success' },
  failed: { label: 'Failed', tone: 'error' },
};
