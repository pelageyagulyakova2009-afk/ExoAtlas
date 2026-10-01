'use client';

import { GalaxyControls } from '@/components/galaxy/GalaxyControls';
import { GalaxyCanvas } from '@/components/galaxy/GalaxyScene';
import { useGalaxyStore } from '@/lib/galaxy/store';
import { useEffect } from 'react';

export default function GalaxyPage({ params }: { params: { seed: string } }) {
  const seed = Number(params.seed) || 1;
  const setSeed = useGalaxyStore((s) => s.setSeed);
  useEffect(() => {
    setSeed(seed);
  }, [seed, setSeed]);
  return (
    <div className="flex h-[calc(100vh-49px)]">
      <div className="min-w-0 flex-1">
        <GalaxyCanvas />
      </div>
      <GalaxyControls seed={seed} />
    </div>
  );
}
