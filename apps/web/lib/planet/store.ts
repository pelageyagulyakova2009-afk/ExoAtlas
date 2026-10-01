'use client';

import type { PlanetParams } from '@exoforge/types';
import { create } from 'zustand';
import { seedToParams } from './params';

interface PlanetState {
  seed: number;
  params: PlanetParams;
  time: number;
  lodLevel: number;
  setSeed: (seed: number) => void;
  setParam: (key: keyof Omit<PlanetParams, 'seed'>, value: number) => void;
  setTime: (time: number) => void;
  setLodLevel: (lodLevel: number) => void;
}

export const usePlanetStore = create<PlanetState>((set) => ({
  seed: 42,
  params: seedToParams(42),
  time: 0,
  lodLevel: 2,
  setSeed: (seed) => set({ seed, params: seedToParams(seed) }),
  setParam: (key, value) =>
    set((state) => ({ params: { ...state.params, [key]: value } })),
  setTime: (time) => set({ time }),
  setLodLevel: (lodLevel) => set({ lodLevel }),
}));
