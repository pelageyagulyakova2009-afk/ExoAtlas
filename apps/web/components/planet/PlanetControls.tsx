'use client';

import type { PlanetParams } from '@exoforge/types';
import { useRouter } from 'next/navigation';
import { LabeledSlider, Section } from '@/components/ui/Controls';
import { PLANET_PRESETS } from '@/lib/planet/presets';
import { usePlanetStore } from '@/lib/planet/store';

export function PlanetControls({ seed }: { seed: number }) {
  const params = usePlanetStore((s) => s.params);
  const preset = usePlanetStore((s) => s.preset);
  const setParam = usePlanetStore((s) => s.setParam);
  const setSeed = usePlanetStore((s) => s.setSeed);
  const applyPreset = usePlanetStore((s) => s.applyPreset);
  const resetSection = usePlanetStore((s) => s.resetSection);
  const router = useRouter();
  const slider = (
    key: keyof Omit<PlanetParams, 'seed'>,
    label: string,
    min: number,
    max: number,
  ) => (
    <LabeledSlider
      key={key}
      label={label}
      min={min}
      max={max}
      step={0.01}
      value={params[key]}
      onChange={(value) => setParam(key, value)}
    />
  );
  return (
    <aside className="w-80 space-y-3 overflow-y-auto border-l border-white/10 bg-[#0a0a0f]/95 p-4 text-sm">
      <label className="block text-xs text-slate-300">
        Preset
        <select
          className="mt-1 w-full rounded-lg bg-black px-2 py-2"
          value={preset}
          onChange={(event) => applyPreset(event.target.value)}
        >
          {Object.keys(PLANET_PRESETS).map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </label>
      <Section title="Seed">
        <input
          className="w-full rounded-lg bg-black px-2 py-2"
          defaultValue={seed}
          type="number"
          onBlur={(event) => {
            const next = Number(event.target.value) || 1;
            setSeed(next);
            router.push(`/planet/${next}`);
          }}
        />
      </Section>
      <Section
        title="Terrain"
        onReset={() => resetSection(['seaLevel', 'temperature', 'moisture'])}
      >
        {slider('seaLevel', 'Sea level', 0, 1)}
        {slider('temperature', 'Temperature', 0, 1)}
        {slider('moisture', 'Moisture', 0, 1)}
      </Section>
      <Section
        title="Atmosphere"
        onReset={() => resetSection(['atmosphereDensity', 'axialTilt'])}
      >
        {slider('atmosphereDensity', 'Density', 0, 1.5)}
        {slider('axialTilt', 'Axial tilt', -0.8, 0.8)}
      </Section>
      <Section title="Clouds" onReset={() => resetSection(['cloudCoverage'])}>
        {slider('cloudCoverage', 'Coverage', 0, 1)}
      </Section>
      <Section title="Water" onReset={() => resetSection(['seaLevel'])}>
        {slider('seaLevel', 'Sea level', 0, 1)}
      </Section>
      <Section title="Lighting" onReset={() => resetSection(['useEarth'])}>
        {slider('useEarth', 'Earth maps', 0, 1)}
      </Section>
      <button
        type="button"
        className="w-full rounded-lg border border-white/15 py-2 hover:bg-white/10"
        onClick={() => applyPreset(preset)}
      >
        Reset all
      </button>
    </aside>
  );
}
