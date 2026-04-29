import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { cn } from '@lib/utils/cn';

export const DropdownMenu = RadixDropdown.Root;
export const DropdownMenuTrigger = RadixDropdown.Trigger;
export const DropdownMenuPortal = RadixDropdown.Portal;
export const DropdownMenuGroup = RadixDropdown.Group;
export const DropdownMenuRadioGroup = RadixDropdown.RadioGroup;

export const DropdownMenuContent = ({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof RadixDropdown.Content>) => (
  <RadixDropdown.Portal>
    <RadixDropdown.Content
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[12rem] overflow-hidden rounded-md border border-outline-variant bg-surface-container-lowest p-1 shadow-popover animate-fade-in',
        className,
      )}
      {...props}
    />
  </RadixDropdown.Portal>
);

export const DropdownMenuItem = ({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof RadixDropdown.Item> & { inset?: boolean }) => (
  <RadixDropdown.Item
    className={cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-body-md text-on-surface outline-none transition-colors',
      'focus:bg-surface-container-low data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
);

export const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixDropdown.Separator>) => (
  <RadixDropdown.Separator
    className={cn('my-1 h-px bg-outline-variant', className)}
    {...props}
  />
);

export const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof RadixDropdown.Label> & { inset?: boolean }) => (
  <RadixDropdown.Label
    className={cn(
      'px-2 py-1 text-label-sm uppercase text-on-surface-variant',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
);
