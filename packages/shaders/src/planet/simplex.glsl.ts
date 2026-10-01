/**
 * Inspired by Inigo Quilez simplex / value-noise articles:
 * https://iquilezles.org/articles/morenoise/
 * https://iquilezles.org/articles/gradientnoise/
 * Structure only. The hash and gradient lattice are TODO(manual) (R1).
 */
export const simplexGlsl = /* glsl */ `
float simplexNoise(vec3 p) {
  // TODO(manual): 3D simplex lattice, skew/unskew, and gradients.
  // Reference: Inigo Quilez, "value noise" and Stefan Gustavson simplex.
  return 0.0;
}
`;
