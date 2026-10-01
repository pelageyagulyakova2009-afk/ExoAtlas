/**
 * Ported from: Inigo Quilez, "Value Noise" lattice interpolation
 * https://iquilezles.org/articles/morenoise/
 * Original author: Inigo Quilez (algorithm). Lattice hash is an original mix for this port.
 * License: article text is published by the author; this implementation is ExoForge code.
 * Adaptations: 3D value noise, no texture lookups, output in [0, 1].
 */
export const simplexGlsl = /* glsl */ `
float hash13(vec3 p) {
  vec3 q = fract(p * vec3(0.1031, 0.11369, 0.13787));
  q += dot(q, q.yzx + 19.19);
  return fract((q.x + q.y) * q.z);
}
float simplexNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  float n000 = hash13(i);
  float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
    mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
    u.z
  );
}
`;
