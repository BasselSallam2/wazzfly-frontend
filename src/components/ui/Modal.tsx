import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '@lib/utils/cn';
import { Icon } from './Icon';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  hideClose?: boolean;
}

const sizeClass = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
} as const;

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  hideClose,
}: ModalProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-primary/40 backdrop-blur-sm animate-fade-in" />
        <RadixDialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-modal animate-fade-in',
            sizeClass[size],
          )}
        >
          {(title || !hideClose) && (
            <div className="flex items-start justify-between gap-3 border-b border-outline-variant px-6 py-4">
              <div className="flex flex-col gap-1">
                {title ? (
                  <RadixDialog.Title className="text-h2 font-semibold text-on-surface">
                    {title}
                  </RadixDialog.Title>
                ) : null}
                {description ? (
                  <RadixDialog.Description className="text-body-sm text-on-surface-variant">
                    {description}
                  </RadixDialog.Description>
                ) : null}
              </div>
              {!hideClose && (
                <RadixDialog.Close
                  aria-label="Close"
                  className="rounded p-1 text-on-surface-variant hover:bg-surface-container-low"
                >
                  <Icon name="close" size={20} />
                </RadixDialog.Close>
              )}
            </div>
          )}
          <div className="px-6 py-5">{children}</div>
          {footer ? (
            <div className="flex items-center justify-end gap-3 border-t border-outline-variant px-6 py-4">
              {footer}
            </div>
          ) : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
