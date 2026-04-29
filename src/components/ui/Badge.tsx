import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-label-sm font-medium uppercase tracking-wide',
  {
    variants: {
      tone: {
        neutral: 'bg-surface-container text-on-surface-variant',
        primary: 'bg-primary-container text-on-primary-container',
        success: 'bg-success-container text-on-success-container',
        warning: 'bg-warning-container text-on-warning-container',
        error: 'bg-error-container text-on-error-container',
        info: 'bg-info-container text-on-info-container',
        secondary: 'bg-secondary-container text-on-secondary-container',
      },
      withDot: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      withDot: false,
    },
  },
);

const dotColor: Record<NonNullable<VariantProps<typeof badgeVariants>['tone']>, string> = {
  neutral: 'bg-outline',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
  secondary: 'bg-secondary',
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone = 'neutral', dot = false, children, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot ? <span className={cn('h-1.5 w-1.5 rounded-full', dotColor[tone ?? 'neutral'])} /> : null}
      {children}
    </span>
  ),
);
Badge.displayName = 'Badge';
