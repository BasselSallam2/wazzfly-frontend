import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '@lib/utils/cn';

export const Tabs = RadixTabs.Root;

export const TabsList = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixTabs.List>) => (
  <RadixTabs.List
    className={cn(
      'inline-flex h-10 items-center gap-1 rounded-lg border border-outline-variant bg-surface-container-low p-1',
      className,
    )}
    {...props}
  />
);

export const TabsTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixTabs.Trigger>) => (
  <RadixTabs.Trigger
    className={cn(
      'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-label-md font-medium text-on-surface-variant transition-colors',
      'data-[state=active]:bg-surface-container-lowest data-[state=active]:text-on-surface data-[state=active]:shadow-card',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
      className,
    )}
    {...props}
  />
);

export const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixTabs.Content>) => (
  <RadixTabs.Content
    className={cn(
      'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
      className,
    )}
    {...props}
  />
);
