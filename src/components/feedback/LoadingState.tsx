import { cn } from '@lib/utils/cn';
import { Icon } from '@components/ui/Icon';

export interface LoadingStateProps {
  label?: string;
  fullPage?: boolean;
  className?: string;
}

export function LoadingState({
  label = 'Loading…',
  fullPage = false,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-on-surface-variant',
        fullPage ? 'min-h-screen' : 'py-16',
        className,
      )}
    >
      <Icon name="progress_activity" size={32} className="animate-spin text-primary" />
      <p className="text-body-md">{label}</p>
    </div>
  );
}
