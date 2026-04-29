import { cn } from '@lib/utils/cn';
import { Icon } from '@components/ui/Icon';

export type BannerTone = 'success' | 'warning' | 'error' | 'info';

export interface ResultBannerProps {
  tone?: BannerTone;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const toneClass: Record<BannerTone, { bg: string; icon: string }> = {
  success: { bg: 'bg-success-container/60 border-success/30 text-on-success-container', icon: 'check_circle' },
  warning: { bg: 'bg-warning-container/60 border-warning/30 text-on-warning-container', icon: 'warning' },
  error: { bg: 'bg-error-container/60 border-error/30 text-on-error-container', icon: 'error' },
  info: { bg: 'bg-info-container/60 border-info/30 text-on-info-container', icon: 'info' },
};

export function ResultBanner({
  tone = 'info',
  title,
  description,
  action,
  className,
}: ResultBannerProps) {
  const t = toneClass[tone];
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        t.bg,
        className,
      )}
    >
      <Icon name={t.icon} size={22} />
      <div className="flex-1">
        <p className="text-label-md font-semibold">{title}</p>
        {description ? <div className="mt-1 text-body-sm">{description}</div> : null}
      </div>
      {action}
    </div>
  );
}
