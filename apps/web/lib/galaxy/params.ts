import type { GalaxyParams } from '@exoforge/types';
import { mulberry32 } from '@/lib/planet/params';

export function seedToGalaxy(seed: number): GalaxyParams {
  const rand = mulberry32(seed ^ 0x9e3779b9);
  return {
    seed,
    arms: 2 + Math.floor(rand() * 4),
    pitchAngle: 0.15 + rand() * 0.35,
    coreSize: 0.08 + rand() * 0.2,
    dustDensity: rand(),
  };
}

export const STAR_COUNT = 50_000;

/** Disk positions. Spiral phase uses a documented placeholder, not the Lin-Shu formula. */
export function buildGalaxyBuffers(params: GalaxyParams, count = STAR_COUNT) {
  const positions = new Float32Array(count * 3);
  const ages = new Float32Array(count);
  const dustPositions = new Float32Array(count * 3);
  let state = params.seed >>> 0;
  const rand = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < count; i += 1) {
    const radius = Math.pow(rand(), 0.65);
    const arm = Math.floor(rand() * params.arms);
    // TODO(manual): replace this angle with the Lin-Shu density-wave phase.
    const theta =
      arm * ((Math.PI * 2) / params.arms) +
      radius / Math.max(params.pitchAngle, 0.05);
    const jitter = (rand() - 0.5) * 0.08;
    const x = Math.cos(theta) * radius + jitter;
    const z = Math.sin(theta) * radius + jitter;
    const y = (rand() - 0.5) * 0.04 * (1 - radius);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    ages[i] = rand();
    dustPositions[i * 3] = x * 1.02;
    dustPositions[i * 3 + 1] = y * 0.3;
    dustPositions[i * 3 + 2] = z * 1.02;
  }
  return { positions, ages, dustPositions };
}
