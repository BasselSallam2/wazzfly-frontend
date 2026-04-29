import * as RadixSelect from '@radix-ui/react-select';
import { forwardRef } from 'react';
import { cn } from '@lib/utils/cn';
import { Icon } from './Icon';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  id?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { value, defaultValue, onValueChange, options, placeholder = 'Select…', disabled, invalid, className, id },
  ref,
) {
  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <RadixSelect.Trigger
        id={id}
        ref={ref}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-surface-container-lowest px-3 text-body-md text-on-surface',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed',
          invalid ? 'border-error focus:border-error focus:ring-error/30' : 'border-outline-variant',
          className,
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <Icon name="expand_more" size={18} className="text-on-surface-variant" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-outline-variant bg-surface-container-lowest shadow-popover animate-fade-in"
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className={cn(
                  'relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 text-body-md text-on-surface outline-none',
                  'data-[highlighted]:bg-surface-container-low data-[state=checked]:bg-primary-container data-[state=checked]:text-on-primary-container',
                  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
                )}
              >
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
});
