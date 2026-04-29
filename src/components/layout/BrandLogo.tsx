import type { ImgHTMLAttributes } from 'react';
import { cn } from '@lib/utils/cn';
import { BRAND_LOGO_URL } from '@/config/constants';

export function BrandLogo({
  className,
  alt = 'Wazzfly',
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={BRAND_LOGO_URL}
      alt={alt}
      decoding="async"
      className={cn('h-8 w-auto max-w-[160px] shrink-0 object-contain object-left', className)}
      {...props}
    />
  );
}
