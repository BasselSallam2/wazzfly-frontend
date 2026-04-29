import { type ReactNode } from 'react';
import { Avatar } from '@components/ui/Avatar';
import { Badge, type BadgeProps } from '@components/ui/Badge';
import { Tooltip } from '@components/ui/Tooltip';
import { formatCurrency } from '@lib/format/currency';
import { formatDateTime, formatRelative } from '@lib/format/date';
import { shortId } from '@lib/format/id';

export function AvatarNameCell({
  name,
  email,
  src,
}: {
  name?: string;
  email?: string;
  src?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={src} name={name ?? email} size="sm" />
      <div className="flex flex-col">
        <span className="text-label-md font-medium text-on-surface">{name ?? '—'}</span>
        {email ? (
          <span className="text-body-sm text-on-surface-variant">{email}</span>
        ) : null}
      </div>
    </div>
  );
}

export function StatusBadgeCell({
  label,
  tone,
}: {
  label: string;
  tone: BadgeProps['tone'];
}) {
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}

export function CurrencyCell({
  amount,
  signDisplay,
}: {
  amount: number | null | undefined;
  signDisplay?: 'auto' | 'always' | 'never';
}) {
  const negative = typeof amount === 'number' && amount < 0;
  return (
    <span className={`tabular text-label-md ${negative ? 'text-error' : 'text-on-surface'}`}>
      {formatCurrency(amount, { signDisplay })}
    </span>
  );
}

export function DateCell({ value }: { value?: string | null }) {
  if (!value) return <span className="text-on-surface-variant">—</span>;
  return (
    <Tooltip content={formatDateTime(value)}>
      <span className="text-body-sm text-on-surface-variant">{formatRelative(value)}</span>
    </Tooltip>
  );
}

export function IdCell({ value }: { value?: string }) {
  return (
    <Tooltip content={value ?? '—'}>
      <span className="font-mono text-body-sm text-on-surface-variant">#{shortId(value)}</span>
    </Tooltip>
  );
}

export function ActionsCell({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-end gap-1">{children}</div>;
}
