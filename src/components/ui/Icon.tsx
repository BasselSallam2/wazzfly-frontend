import { cn } from '@lib/utils/cn';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number;
  filled?: boolean;
  weight?: 300 | 400 | 500 | 600 | 700;
}

export function Icon({
  name,
  size = 20,
  filled = false,
  weight = 400,
  className,
  style,
  ...rest
}: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('material-symbols-outlined select-none leading-none', className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
      {...rest}
    >
      {name}
    </span>
  );
}
