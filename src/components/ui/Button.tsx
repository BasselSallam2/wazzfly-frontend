import { Children, cloneElement, forwardRef, isValidElement, type ReactElement } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@lib/utils/cn';
import { Icon } from './Icon';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-label-md font-medium transition-colors focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'bg-primary !text-white [color:white] hover:bg-primary/90 active:bg-primary/85 hover:!text-white [&_.material-symbols-outlined]:!text-inherit',
        secondary:
          'bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container-low active:bg-surface-container',
        ghost: 'bg-transparent text-on-surface hover:bg-surface-container-low',
        danger: 'bg-error text-on-error hover:bg-error/90 active:bg-error/85',
        success: 'bg-success text-on-success hover:bg-success/90 active:bg-success/85',
        link: 'text-primary underline-offset-4 hover:underline px-0 h-auto',
      },
      size: {
        sm: 'h-8 px-3 text-body-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-5 text-body-lg',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  iconLeft?: string;
  iconRight?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild, loading, iconLeft, iconRight, children, disabled, type, ...props },
    ref,
  ) => {
    const classes = cn(buttonVariants({ variant, size }), className);
    const iconSize = size === 'sm' ? 16 : 18;
    const isPrimary = variant === 'primary' || !variant;
    const iconClass = isPrimary ? 'text-inherit' : undefined;
    const spinClass = isPrimary ? 'animate-spin text-inherit' : 'animate-spin';

    if (asChild) {
      const child = Children.only(children);
      if (!isValidElement(child)) {
        throw new Error('Button with asChild expects a single React element child.');
      }

      const childProps = (child as ReactElement<{ className?: string; children?: React.ReactNode; onClick?: (e: React.MouseEvent) => void }>)
        .props;

      if (loading) {
        return (
          <Slot ref={ref} className={classes} {...props}>
            {cloneElement(child, {
              'aria-disabled': true,
              className: cn('pointer-events-none', childProps.className),
              onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                childProps.onClick?.(e);
              },
              children: <Icon name="progress_activity" size={iconSize} className={spinClass} />,
            } as never)}
          </Slot>
        );
      }

      if (iconLeft || iconRight) {
        return (
          <Slot ref={ref} className={classes} aria-disabled={disabled} {...props}>
            {cloneElement(child, {
              'aria-disabled': disabled ? true : undefined,
              className: cn('inline-flex items-center justify-center gap-2', childProps.className),
              children: (
                <>
                  {iconLeft ? <Icon name={iconLeft} size={iconSize} className={iconClass} /> : null}
                  {childProps.children}
                  {iconRight ? <Icon name={iconRight} size={iconSize} className={iconClass} /> : null}
                </>
              ),
            } as never)}
          </Slot>
        );
      }

      return (
        <Slot ref={ref} className={classes} aria-disabled={disabled ? true : undefined} {...props}>
          {child}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        type={type ?? 'button'}
        {...props}
      >
        {loading ? (
          <Icon
            name="progress_activity"
            size={18}
            className={isPrimary ? 'animate-spin text-inherit' : 'animate-spin'}
          />
        ) : iconLeft ? (
          <Icon
            name={iconLeft}
            size={size === 'sm' ? 16 : 18}
            className={isPrimary ? 'text-inherit' : undefined}
          />
        ) : null}
        {children}
        {!loading && iconRight ? (
          <Icon
            name={iconRight}
            size={size === 'sm' ? 16 : 18}
            className={isPrimary ? 'text-inherit' : undefined}
          />
        ) : null}
      </button>
    );
  },
);
Button.displayName = 'Button';
