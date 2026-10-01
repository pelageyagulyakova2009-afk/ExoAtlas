import type { GalaxyParams } from '@exoforge/types';
import { buildGalaxyBuffers as buildDisk, STAR_COUNT } from '@exoforge/shaders';
import { mulberry32 } from '@/lib/planet/params';

export { STAR_COUNT };

export function seedToGalaxy(seed: number): GalaxyParams {
  const rand = mulberry32(seed ^ 0x9e3779b9);
  return {
    seed,
    arms: 2 + Math.floor(rand() * 4),
    pitchAngle: 0.18 + rand() * 0.28,
    coreSize: 0.08 + rand() * 0.12,
    dustDensity: 0.3 + rand() * 0.6,
    bar: rand() > 0.5 ? 1 : 0,
    patternSpeed: rand() * 0.4,
  };
}

export function buildGalaxyBuffers(params: GalaxyParams, count = STAR_COUNT) {
  return buildDisk(params, count);
}

export const GALAXY_PRESETS: Record<string, Omit<GalaxyParams, 'seed'>> = {
  'Milky Way': {
    arms: 4,
    pitchAngle: 0.22,
    coreSize: 0.12,
    dustDensity: 0.7,
    bar: 1,
    patternSpeed: 0.1,
  },
  Andromeda: {
    arms: 2,
    pitchAngle: 0.16,
    coreSize: 0.16,
    dustDensity: 0.45,
    bar: 0,
    patternSpeed: 0.05,
  },
  Whirlpool: {
    arms: 2,
    pitchAngle: 0.28,
    coreSize: 0.08,
    dustDensity: 0.55,
    bar: 0,
    patternSpeed: 0.2,
  },
  Sombrero: {
    arms: 2,
    pitchAngle: 0.12,
    coreSize: 0.22,
    dustDensity: 0.85,
    bar: 0,
    patternSpeed: 0,
  },
  Pinwheel: {
    arms: 6,
    pitchAngle: 0.26,
    coreSize: 0.07,
    dustDensity: 0.4,
    bar: 0,
    patternSpeed: 0.15,
  },
};
