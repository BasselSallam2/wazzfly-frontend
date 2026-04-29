import { forwardRef } from 'react';
import { Input, type InputProps } from '@components/ui/Input';

export type MoneyInputProps = Omit<InputProps, 'type'>;

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>((props, ref) => (
  <Input
    ref={ref}
    type="number"
    step="0.01"
    min={0}
    inputMode="decimal"
    iconLeft="attach_money"
    placeholder="0.00"
    className="tabular"
    {...props}
  />
));
MoneyInput.displayName = 'MoneyInput';
