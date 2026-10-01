'use client';

import type { FeatureTag, PlanetParams } from '@exoforge/types';
import { create } from 'zustand';
import { seedToParams } from './params';
import { PLANET_PRESETS } from './presets';

interface PlanetState {
  seed: number;
  params: PlanetParams;
  preset: string;
  time: number;
  lodLevel: number;
  tags: FeatureTag[];
  confidence: number;
  toast: string;
  setSeed: (seed: number) => void;
  setParam: (key: keyof Omit<PlanetParams, 'seed'>, value: number) => void;
  applyPreset: (name: string) => void;
  resetSection: (keys: Array<keyof Omit<PlanetParams, 'seed'>>) => void;
  setTime: (time: number) => void;
  setLodLevel: (lodLevel: number) => void;
  toggleTag: (tag: FeatureTag) => void;
  setConfidence: (confidence: number) => void;
  setToast: (toast: string) => void;
}

export const usePlanetStore = create<PlanetState>((set, get) => ({
  seed: 42,
  params: { ...seedToParams(42), ...PLANET_PRESETS['Earth-like'] },
  preset: 'Earth-like',
  time: 0,
  lodLevel: 3,
  tags: [],
  confidence: 0.7,
  toast: '',
  setSeed: (seed) =>
    set({
      seed,
      params: { ...seedToParams(seed), ...PLANET_PRESETS[get().preset] },
      tags: [],
    }),
  setParam: (key, value) =>
    set((state) => ({ params: { ...state.params, [key]: value } })),
  applyPreset: (name) => {
    const preset = PLANET_PRESETS[name];
    if (!preset) return;
    set((state) => ({ preset: name, params: { ...state.params, ...preset } }));
  },
  resetSection: (keys) => {
    const base = {
      ...seedToParams(get().seed),
      ...PLANET_PRESETS[get().preset],
    };
    set((state) => {
      const params = { ...state.params };
      for (const key of keys) params[key] = base[key];
      return { params };
    });
  },
  setTime: (time) => set({ time }),
  setLodLevel: (lodLevel) => set({ lodLevel }),
  toggleTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag)
        ? state.tags.filter((item) => item !== tag)
        : [...state.tags, tag],
    })),
  setConfidence: (confidence) => set({ confidence }),
  setToast: (toast) => set({ toast }),
}));
