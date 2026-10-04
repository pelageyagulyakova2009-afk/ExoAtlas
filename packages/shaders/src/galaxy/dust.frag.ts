/**
 * Dust lanes sit on the inner edge of the density wave.
 * Ported from: the dark-lane look of spiral galaxies; particles are placed in galaxy.ts.
 * Original author: n/a. Shader is ExoForge code.
 * License: project code.
 * Adaptations: dark multiply-friendly color so lanes stay darker than the arms.
 */
export const dustFrag = /* glsl */ `
uniform float uDustDensity;
void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  if (dot(uv, uv) > 1.0) discard;
  gl_FragColor = vec4(0.15, 0.08, 0.04, 0.85 * uDustDensity);
}
`;
