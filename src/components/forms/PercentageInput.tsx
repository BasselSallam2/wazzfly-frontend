import { forwardRef } from 'react';
import { Input, type InputProps } from '@components/ui/Input';

export type PercentageInputProps = Omit<InputProps, 'type'>;

export const PercentageInput = forwardRef<HTMLInputElement, PercentageInputProps>((props, ref) => (
  <Input
    ref={ref}
    type="number"
    step="0.1"
    min={0}
    max={100}
    inputMode="decimal"
    iconRight="percent"
    placeholder="0"
    className="tabular"
    {...props}
  />
));
PercentageInput.displayName = 'PercentageInput';
