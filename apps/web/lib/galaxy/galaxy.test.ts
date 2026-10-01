import { describe, expect, it } from 'vitest';
import { STAR_COUNT, buildGalaxyBuffers, seedToGalaxy } from './params';

describe('galaxy seeds', () => {
  it('is deterministic and emits 50k stars', () => {
    const params = seedToGalaxy(7);
    const a = buildGalaxyBuffers(params, 128);
    const b = buildGalaxyBuffers(params, 128);
    expect(a.positions).toEqual(b.positions);
    expect(buildGalaxyBuffers(params).positions.length).toBe(STAR_COUNT * 3);
  });
});
