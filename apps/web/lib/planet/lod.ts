/**
 * Cube-sphere quadtree.
 * Inspired by FunSoftWareTechologies/OpenWorlds (PlanetTechJS) face patches
 * and ZyFou/ProceduralTerrains cube-sphere grids.
 * Height displacement is TODO(manual) inside the vertex shader.
 */

export type CubeFace = 0 | 1 | 2 | 3 | 4 | 5;

export interface PatchId {
  face: CubeFace;
  level: number;
  x: number;
  y: number;
}

export interface MeshPatch {
  id: PatchId;
  positions: Float32Array;
  indices: Uint32Array;
}

const FACE_AXES: Array<[number, number, number]> = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

function faceToCube(
  face: CubeFace,
  u: number,
  v: number,
): [number, number, number] {
  const [nx, ny, nz] = FACE_AXES[face];
  if (nx !== 0) return [nx, u, v];
  if (ny !== 0) return [v, ny, u];
  return [u, v, nz];
}

export function cubeToSphere(
  x: number,
  y: number,
  z: number,
): [number, number, number] {
  const x2 = x * x;
  const y2 = y * y;
  const z2 = z * z;
  const sx = x * Math.sqrt(1 - y2 / 2 - z2 / 2 + (y2 * z2) / 3);
  const sy = y * Math.sqrt(1 - z2 / 2 - x2 / 2 + (z2 * x2) / 3);
  const sz = z * Math.sqrt(1 - x2 / 2 - y2 / 2 + (x2 * y2) / 3);
  return [sx, sy, sz];
}

export function buildPatch(id: PatchId, segments = 8): MeshPatch {
  const span = 2 / 2 ** id.level;
  const originU = -1 + id.x * span;
  const originV = -1 + id.y * span;
  const verts = segments + 1;
  const positions = new Float32Array(verts * verts * 3);
  let cursor = 0;
  for (let j = 0; j < verts; j += 1) {
    for (let i = 0; i < verts; i += 1) {
      const u = originU + (i / segments) * span;
      const v = originV + (j / segments) * span;
      const cube = faceToCube(id.face, u, v);
      const sphere = cubeToSphere(cube[0], cube[1], cube[2]);
      positions[cursor] = sphere[0];
      positions[cursor + 1] = sphere[1];
      positions[cursor + 2] = sphere[2];
      cursor += 3;
    }
  }
  const indices = new Uint32Array(segments * segments * 6);
  let index = 0;
  for (let j = 0; j < segments; j += 1) {
    for (let i = 0; i < segments; i += 1) {
      const a = j * verts + i;
      indices[index] = a;
      indices[index + 1] = a + verts;
      indices[index + 2] = a + 1;
      indices[index + 3] = a + 1;
      indices[index + 4] = a + verts;
      indices[index + 5] = a + verts + 1;
      index += 6;
    }
  }
  return { id, positions, indices };
}

/** Select patches whose screen-size proxy exceeds the split threshold. */
export function selectPatches(cameraDistance: number, maxLevel = 4): PatchId[] {
  const selected: PatchId[] = [];
  const visit = (id: PatchId) => {
    const span = 2 / 2 ** id.level;
    const shouldSplit =
      id.level < maxLevel && cameraDistance < 1.15 + span * 1.5;
    if (!shouldSplit) {
      selected.push(id);
      return;
    }
    for (const dx of [0, 1]) {
      for (const dy of [0, 1]) {
        visit({
          face: id.face,
          level: id.level + 1,
          x: id.x * 2 + dx,
          y: id.y * 2 + dy,
        });
      }
    }
  };
  for (let face = 0 as CubeFace; face < 6; face = (face + 1) as CubeFace) {
    visit({ face, level: 0, x: 0, y: 0 });
  }
  return selected;
}

export function edgePositions(
  patch: MeshPatch,
  edge: 'left' | 'right' | 'bottom' | 'top',
  segments = 8,
): number[][] {
  const verts = segments + 1;
  const rows: number[][] = [];
  for (let k = 0; k < verts; k += 1) {
    let i = 0;
    let j = 0;
    if (edge === 'left') {
      i = 0;
      j = k;
    } else if (edge === 'right') {
      i = segments;
      j = k;
    } else if (edge === 'bottom') {
      i = k;
      j = 0;
    } else {
      i = k;
      j = segments;
    }
    const offset = (j * verts + i) * 3;
    rows.push([
      patch.positions[offset],
      patch.positions[offset + 1],
      patch.positions[offset + 2],
    ]);
  }
  return rows;
}
