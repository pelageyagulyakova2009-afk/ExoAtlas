'use client';

import { useRouter } from 'next/navigation';
import { LabeledSlider, Section } from '@/components/ui/Controls';
import { GALAXY_PRESETS } from '@/lib/galaxy/params';
import { useGalaxyStore } from '@/lib/galaxy/store';

export function GalaxyControls({ seed }: { seed: number }) {
  const params = useGalaxyStore((s) => s.params);
  const preset = useGalaxyStore((s) => s.preset);
  const setParam = useGalaxyStore((s) => s.setParam);
  const setSeed = useGalaxyStore((s) => s.setSeed);
  const applyPreset = useGalaxyStore((s) => s.applyPreset);
  const router = useRouter();
  return (
    <aside className="w-80 space-y-3 overflow-y-auto border-l border-white/10 bg-[#0a0a0f]/95 p-4">
      <label className="block text-xs">
        Preset
        <select
          className="mt-1 w-full rounded-lg bg-black px-2 py-2"
          value={preset}
          onChange={(e) => applyPreset(e.target.value)}
        >
          {Object.keys(GALAXY_PRESETS).map((name) => (
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
            router.push(`/galaxy/${next}`);
          }}
        />
      </Section>
      <Section title="Disk">
        <LabeledSlider
          label="Arms"
          min={2}
          max={6}
          step={1}
          value={params.arms}
          onChange={(v) => setParam('arms', v)}
        />
        <LabeledSlider
          label="Pitch"
          min={0.12}
          max={0.52}
          step={0.01}
          value={params.pitchAngle}
          onChange={(v) => setParam('pitchAngle', v)}
        />
        <LabeledSlider
          label="Core"
          min={0.04}
          max={0.3}
          step={0.01}
          value={params.coreSize}
          onChange={(v) => setParam('coreSize', v)}
        />
        <LabeledSlider
          label="Dust"
          min={0}
          max={1}
          step={0.01}
          value={params.dustDensity}
          onChange={(v) => setParam('dustDensity', v)}
        />
        <LabeledSlider
          label="Bar"
          min={0}
          max={1}
          step={1}
          value={params.bar}
          onChange={(v) => setParam('bar', v)}
        />
        <LabeledSlider
          label="Pattern speed"
          min={0}
          max={1}
          step={0.01}
          value={params.patternSpeed}
          onChange={(v) => setParam('patternSpeed', v)}
        />
      </Section>
    </aside>
  );
}
