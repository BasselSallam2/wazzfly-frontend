import * as RadixLabel from '@radix-ui/react-label';
import { cn } from '@lib/utils/cn';

export const Label = ({
  className,
  ...props
}: React.ComponentProps<typeof RadixLabel.Root>) => (
  <RadixLabel.Root
    className={cn('text-label-md font-medium text-on-surface', className)}
    {...props}
  />
);
