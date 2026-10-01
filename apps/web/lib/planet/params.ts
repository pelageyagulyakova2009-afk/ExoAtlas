import type { PlanetParams } from '@exoforge/types';

/** Mulberry32. Same seed always yields the same parameter vector. */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedToParams(seed: number): PlanetParams {
  const rand = mulberry32(seed);
  return {
    seed,
    seaLevel: 0.35 + rand() * 0.25,
    temperature: rand(),
    moisture: rand(),
    cloudCoverage: 0.2 + rand() * 0.6,
    atmosphereDensity: 0.4 + rand() * 0.6,
    axialTilt: (rand() - 0.5) * 0.6,
    useEarth: 0,
  };
}
