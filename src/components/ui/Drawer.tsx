import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '@lib/utils/cn';
import { Icon } from './Icon';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

const widthClass = {
  sm: 'w-[400px]',
  md: 'w-[500px]',
  lg: 'w-[600px]',
} as const;

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  width = 'md',
}: DrawerProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-primary/30 backdrop-blur-sm animate-fade-in" />
        <RadixDialog.Content
          className={cn(
            'fixed right-0 top-0 z-50 flex h-full max-w-[95vw] flex-col bg-surface-container-lowest shadow-modal animate-slide-in-right',
            widthClass[width],
          )}
        >
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
            <RadixDialog.Close
              aria-label="Close"
              className="rounded p-1 text-on-surface-variant hover:bg-surface-container-low"
            >
              <Icon name="close" size={20} />
            </RadixDialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5">{children}</div>
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
