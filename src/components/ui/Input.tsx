import { forwardRef } from 'react';
import { cn } from '@lib/utils/cn';
import { Icon } from './Icon';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: string;
  iconRight?: string;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, iconLeft, iconRight, invalid, type = 'text', ...props }, ref) => {
    return (
      <div className="relative w-full">
        {iconLeft ? (
          <Icon
            name={iconLeft}
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
        ) : null}
        <input
          ref={ref}
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border bg-surface-container-lowest px-3 text-body-md text-on-surface placeholder:text-on-surface-variant transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-60',
            invalid ? 'border-error focus:border-error focus:ring-error/30' : 'border-outline-variant',
            iconLeft && 'pl-9',
            iconRight && 'pr-9',
            className,
          )}
          {...props}
        />
        {iconRight ? (
          <Icon
            name={iconRight}
            size={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';
