'use client';

import { LabelPanel } from '@/components/annotate/LabelPanel';
import type { PlanetParams } from '@exoforge/types';
import { useRouter } from 'next/navigation';
import { usePlanetStore } from '@/lib/planet/store';

const SLIDERS: Array<{
  key: keyof Omit<PlanetParams, 'seed'>;
  label: string;
  min: number;
  max: number;
  step: number;
}> = [
  { key: 'seaLevel', label: 'Sea level', min: 0, max: 1, step: 0.01 },
  { key: 'temperature', label: 'Temperature', min: 0, max: 1, step: 0.01 },
  { key: 'moisture', label: 'Moisture', min: 0, max: 1, step: 0.01 },
  { key: 'cloudCoverage', label: 'Cloud coverage', min: 0, max: 1, step: 0.01 },
  {
    key: 'atmosphereDensity',
    label: 'Atmosphere density',
    min: 0,
    max: 1.5,
    step: 0.01,
  },
  { key: 'axialTilt', label: 'Axial tilt', min: -0.8, max: 0.8, step: 0.01 },
];

export function PlanetControls({ seed }: { seed: number }) {
  const params = usePlanetStore((s) => s.params);
  const lod = usePlanetStore((s) => s.lodLevel);
  const setParam = usePlanetStore((s) => s.setParam);
  const setSeed = usePlanetStore((s) => s.setSeed);
  const router = useRouter();

  return (
    <aside className="w-72 space-y-3 overflow-y-auto border-l border-slate-800 bg-panel p-4 text-sm">
      <label className="block">
        Seed
        <input
          className="mt-1 w-full rounded bg-ink px-2 py-1"
          defaultValue={seed}
          type="number"
          onBlur={(event) => {
            const next = Number(event.target.value) || 1;
            setSeed(next);
            router.push(`/planet/${next}`);
          }}
        />
      </label>
      {SLIDERS.map((slider) => (
        <label key={slider.key} className="block">
          <span className="flex justify-between">
            {slider.label}
            <span className="text-slate-400">
              {params[slider.key].toFixed(2)}
            </span>
          </span>
          <input
            className="w-full"
            type="range"
            min={slider.min}
            max={slider.max}
            step={slider.step}
            value={params[slider.key]}
            onChange={(event) =>
              setParam(slider.key, Number(event.target.value))
            }
          />
        </label>
      ))}
      <p className="text-slate-400">
        LOD ceiling {lod}. Shader math is marked TODO(manual).
      </p>
      <LabelPanel objectHint="planet" />
    </aside>
  );
}
