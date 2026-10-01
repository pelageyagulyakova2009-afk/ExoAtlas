/**
 * Ridged fractal. Inspired by dgreenheck/threejs-procedural-planets
 * and Inigo Quilez domain warping: https://iquilezles.org/articles/warp/
 * TODO(manual): ridge abs(noise) inversion and domain warp (R1).
 */
export const ridgedGlsl = /* glsl */ `
float ridged(vec3 p) {
  // TODO(manual): ridged multifractal.
  return 0.0;
}
`;
