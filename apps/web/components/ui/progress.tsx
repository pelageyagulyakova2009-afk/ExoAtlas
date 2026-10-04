/**
 * Ported from: MAY55A/SciBitHub src/components/ui/progress.tsx
 * Original author: MAY55A
 * License: AGPL-3.0
 * Adaptations: Radix progress, value 0-100, sky fill.
 */
'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/cn';

export function Progress({
  className,
  value,
}: {
  className?: string;
  value: number;
}) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-white/10',
        className,
      )}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-[#4a9eff] transition-transform"
        style={{
          transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}
