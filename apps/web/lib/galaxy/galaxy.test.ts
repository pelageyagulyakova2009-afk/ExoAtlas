import { armAngle } from '@exoforge/shaders';
import { describe, expect, it } from 'vitest';
import { STAR_COUNT, buildGalaxyBuffers, seedToGalaxy } from './params';

describe('galaxy seeds', () => {
  it('is deterministic and keeps the star budget available', () => {
    const params = seedToGalaxy(7);
    const a = buildGalaxyBuffers(params, 128);
    const b = buildGalaxyBuffers(params, 128);
    expect(a.positions).toEqual(b.positions);
    expect(buildGalaxyBuffers(params, 64).positions.length).toBe(64 * 3);
    expect(armAngle(0.8, 0, 2, 0.3)).toBeGreaterThan(armAngle(0.2, 0, 2, 0.3));
  });
});
