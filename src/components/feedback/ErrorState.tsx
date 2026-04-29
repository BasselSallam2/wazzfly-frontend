import { cn } from '@lib/utils/cn';
import { Icon } from '@components/ui/Icon';
import { Button } from '@components/ui/Button';
import { isApiError } from '@lib/api/errors';

export interface ErrorStateProps {
  error?: unknown;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ error, title, description, onRetry, className }: ErrorStateProps) {
  const heading = title ?? 'Something went wrong';
  const message =
    description ??
    (isApiError(error) ? error.message : error instanceof Error ? error.message : 'Please try again.');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-error/30 bg-error-container/30 px-6 py-10 text-center',
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error-container text-on-error-container">
        <Icon name="error" size={28} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-h3 font-semibold text-on-surface">{heading}</p>
        <p className="max-w-md text-body-sm text-on-surface-variant">{message}</p>
        {isApiError(error) && error.status ? (
          <p className="text-body-sm font-mono text-on-surface-variant">Status {error.status}</p>
        ) : null}
      </div>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry} iconLeft="refresh">
          Try again
        </Button>
      ) : null}
    </div>
  );
}
