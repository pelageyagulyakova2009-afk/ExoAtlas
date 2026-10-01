'use client';

import { LabelPanel } from '@/components/annotate/LabelPanel';
import { useRouter } from 'next/navigation';
import { useGalaxyStore } from '@/lib/galaxy/store';

export function GalaxyControls({ seed }: { seed: number }) {
  const params = useGalaxyStore((s) => s.params);
  const setParam = useGalaxyStore((s) => s.setParam);
  const setSeed = useGalaxyStore((s) => s.setSeed);
  const router = useRouter();
  return (
    <aside className="w-72 space-y-3 border-l border-slate-800 bg-panel p-4 text-sm">
      <label className="block">
        Seed
        <input
          className="mt-1 w-full rounded bg-ink px-2 py-1"
          defaultValue={seed}
          type="number"
          onBlur={(event) => {
            const next = Number(event.target.value) || 1;
            setSeed(next);
            router.push(`/galaxy/${next}`);
          }}
        />
      </label>
      <label className="block">
        Arms {params.arms}
        <input
          className="w-full"
          type="range"
          min={2}
          max={6}
          step={1}
          value={params.arms}
          onChange={(event) => setParam('arms', Number(event.target.value))}
        />
      </label>
      <label className="block">
        Pitch angle {params.pitchAngle.toFixed(2)}
        <input
          className="w-full"
          type="range"
          min={0.08}
          max={0.8}
          step={0.01}
          value={params.pitchAngle}
          onChange={(event) =>
            setParam('pitchAngle', Number(event.target.value))
          }
        />
      </label>
      <label className="block">
        Core size {params.coreSize.toFixed(2)}
        <input
          className="w-full"
          type="range"
          min={0.02}
          max={0.4}
          step={0.01}
          value={params.coreSize}
          onChange={(event) => setParam('coreSize', Number(event.target.value))}
        />
      </label>
      <label className="block">
        Dust density {params.dustDensity.toFixed(2)}
        <input
          className="w-full"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={params.dustDensity}
          onChange={(event) =>
            setParam('dustDensity', Number(event.target.value))
          }
        />
      </label>
      <LabelPanel objectHint="galaxy" />
    </aside>
  );
}
