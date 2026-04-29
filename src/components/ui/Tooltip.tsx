import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '@lib/utils/cn';

export const TooltipProvider = ({
  children,
  delayDuration = 250,
}: {
  children: React.ReactNode;
  delayDuration?: number;
}) => (
  <RadixTooltip.Provider delayDuration={delayDuration} skipDelayDuration={100}>
    {children}
  </RadixTooltip.Provider>
);

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function Tooltip({ content, children, side = 'top', align = 'center', className }: TooltipProps) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={6}
          className={cn(
            'z-50 max-w-xs rounded-md bg-inverse-surface px-3 py-1.5 text-body-sm text-inverse-on-surface shadow-popover animate-fade-in',
            className,
          )}
        >
          {content}
          <RadixTooltip.Arrow className="fill-inverse-surface" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
