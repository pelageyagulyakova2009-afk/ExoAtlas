'use client';

import type { GalaxyParams } from '@exoforge/types';
import { create } from 'zustand';
import { GALAXY_PRESETS, seedToGalaxy } from './params';

interface GalaxyState {
  seed: number;
  params: GalaxyParams;
  preset: string;
  setSeed: (seed: number) => void;
  setParam: (key: keyof Omit<GalaxyParams, 'seed'>, value: number) => void;
  applyPreset: (name: string) => void;
}

export const useGalaxyStore = create<GalaxyState>((set, get) => ({
  seed: 7,
  params: { ...seedToGalaxy(7), ...GALAXY_PRESETS['Whirlpool'] },
  preset: 'Whirlpool',
  setSeed: (seed) =>
    set({
      seed,
      params: { ...seedToGalaxy(seed), ...GALAXY_PRESETS[get().preset] },
    }),
  setParam: (key, value) =>
    set((state) => ({ params: { ...state.params, [key]: value } })),
  applyPreset: (name) => {
    const preset = GALAXY_PRESETS[name];
    if (!preset) return;
    set((state) => ({ preset: name, params: { ...state.params, ...preset } }));
  },
}));
