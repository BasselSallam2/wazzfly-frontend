import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { cn } from '@lib/utils/cn';
import { Icon } from './Icon';

export interface CheckboxProps extends React.ComponentProps<typeof RadixCheckbox.Root> {}

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <RadixCheckbox.Root
      className={cn(
        'peer flex h-4 w-4 items-center justify-center rounded border border-outline-variant bg-surface-container-lowest transition-colors',
        'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-on-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      <RadixCheckbox.Indicator className="text-current">
        <Icon name="check" size={14} weight={600} />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
}
