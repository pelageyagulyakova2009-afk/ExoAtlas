import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes } from 'react';

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-ink',
        className,
      )}
      {...props}
    />
  );
}
