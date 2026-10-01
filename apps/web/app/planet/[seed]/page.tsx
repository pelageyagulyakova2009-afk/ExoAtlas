'use client';

import { PlanetControls } from '@/components/planet/PlanetControls';
import { PlanetScene } from '@/components/planet/PlanetScene';
import { usePlanetStore } from '@/lib/planet/store';
import { useEffect } from 'react';

export default function PlanetPage({ params }: { params: { seed: string } }) {
  const seed = Number(params.seed) || 1;
  const setSeed = usePlanetStore((s) => s.setSeed);
  useEffect(() => {
    setSeed(seed);
  }, [seed, setSeed]);

  return (
    <div className="flex h-[calc(100vh-49px)]">
      <div className="relative min-w-0 flex-1">
        <PlanetScene />
      </div>
      <PlanetControls seed={seed} />
    </div>
  );
}
