'use client';

import type { GalaxyParams } from '@exoforge/types';
import { create } from 'zustand';
import { seedToGalaxy } from './params';

interface GalaxyState {
  seed: number;
  params: GalaxyParams;
  setSeed: (seed: number) => void;
  setParam: (key: keyof Omit<GalaxyParams, 'seed'>, value: number) => void;
}

export const useGalaxyStore = create<GalaxyState>((set) => ({
  seed: 7,
  params: seedToGalaxy(7),
  setSeed: (seed) => set({ seed, params: seedToGalaxy(seed) }),
  setParam: (key, value) =>
    set((state) => ({ params: { ...state.params, [key]: value } })),
}));
