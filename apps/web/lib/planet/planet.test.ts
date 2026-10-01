import { describe, expect, it } from 'vitest';
import { buildPatch, edgePositions, selectPatches } from './lod';
import { seedToParams } from './params';

describe('seedToParams', () => {
  it('is deterministic', () => {
    expect(seedToParams(99)).toEqual(seedToParams(99));
    expect(seedToParams(99).temperature).not.toBe(
      seedToParams(100).temperature,
    );
  });
});

describe('cube-sphere LOD', () => {
  it('shares an edge between adjacent same-level patches', () => {
    const left = buildPatch({ face: 4, level: 1, x: 0, y: 0 });
    const right = buildPatch({ face: 4, level: 1, x: 1, y: 0 });
    const a = edgePositions(left, 'right');
    const b = edgePositions(right, 'left');
    expect(a.length).toBe(b.length);
    a.forEach((point, index) => {
      point.forEach((value, axis) => {
        expect(Math.abs(value - b[index][axis])).toBeLessThan(1e-6);
      });
    });
  });

  it('covers every face when the camera is far', () => {
    const patches = selectPatches(8, 3);
    const faces = new Set(patches.map((patch) => patch.face));
    expect(faces.size).toBe(6);
    expect(patches.every((patch) => patch.level === 0)).toBe(true);
  });
});
