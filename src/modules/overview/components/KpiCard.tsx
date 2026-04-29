import { cn } from '@lib/utils/cn';
import { Card } from '@components/ui/Card';
import { Icon } from '@components/ui/Icon';
import { Skeleton } from '@components/ui/Skeleton';

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  icon: string;
  delta?: { value: number; suffix?: string; positiveIsGood?: boolean };
  helper?: string;
  loading?: boolean;
  tone?: 'primary' | 'success' | 'warning' | 'info' | 'neutral';
}

const toneIconBg: Record<NonNullable<KpiCardProps['tone']>, string> = {
  primary: 'bg-primary-container text-on-primary-container',
  success: 'bg-success-container text-on-success-container',
  warning: 'bg-warning-container text-on-warning-container',
  info: 'bg-info-container text-on-info-container',
  neutral: 'bg-surface-container-high text-on-surface-variant',
};

export function KpiCard({
  label,
  value,
  icon,
  delta,
  helper,
  loading,
  tone = 'primary',
}: KpiCardProps) {
  const positive = delta ? delta.value >= 0 : false;
  const goodNess = delta?.positiveIsGood ?? true;
  const isGood = positive === goodNess;

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between">
        <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">{label}</p>
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-md',
            toneIconBg[tone],
          )}
        >
          <Icon name={icon} size={18} />
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {loading ? (
          <Skeleton className="h-9 w-32" />
        ) : (
          <span className="text-display tabular text-on-surface">{value}</span>
        )}
        <div className="flex items-center gap-2 text-body-sm">
          {delta ? (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-label-sm font-medium',
                isGood
                  ? 'bg-success-container text-on-success-container'
                  : 'bg-error-container text-on-error-container',
              )}
            >
              <Icon name={positive ? 'arrow_upward' : 'arrow_downward'} size={14} />
              {Math.abs(delta.value)}
              {delta.suffix ?? '%'}
            </span>
          ) : null}
          {helper ? <span className="text-on-surface-variant">{helper}</span> : null}
        </div>
      </div>
    </Card>
  );
}
