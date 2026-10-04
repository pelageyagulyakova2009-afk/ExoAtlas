/**
 * Ported from: MAY55A/SciBitHub src/components/ui/badge.tsx
 * Original author: MAY55A
 * License: AGPL-3.0
 * Adaptations: two variants, ExoForge accent.
 */
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border border-sky-400/40 px-2 py-0.5 text-xs text-sky-200',
        className,
      )}
      {...props}
    />
  );
}
