/**
 * Ported from: Inigo Quilez, "Domain warping"
 * https://iquilezles.org/articles/warp/
 * Original author: Inigo Quilez
 * License: published article; this warp is ExoForge code.
 * Adaptations: one warp of fBm, strength 0.85.
 */
export const domainWarpGlsl = /* glsl */ `
vec3 domainWarp(vec3 p) {
  vec3 q = vec3(
    fbm(p + vec3(0.0, 0.0, 0.0)),
    fbm(p + vec3(5.2, 1.3, 2.8)),
    fbm(p + vec3(1.7, 9.2, 3.1))
  );
  return p + 0.85 * q;
}
`;
