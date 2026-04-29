import * as RadixAvatar from '@radix-ui/react-avatar';
import { cn } from '@lib/utils/cn';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClass = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-[12px]',
  md: 'h-10 w-10 text-[14px]',
  lg: 'h-14 w-14 text-[18px]',
} as const;

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[1]!.charAt(0)).toUpperCase();
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  return (
    <RadixAvatar.Root
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary-container text-on-secondary-container font-semibold uppercase select-none',
        sizeClass[size],
        className,
      )}
    >
      {src ? (
        <RadixAvatar.Image src={src} alt={alt ?? name ?? ''} className="h-full w-full object-cover" />
      ) : null}
      <RadixAvatar.Fallback delayMs={150} className="flex h-full w-full items-center justify-center">
        {getInitials(name ?? alt)}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
