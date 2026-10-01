/** Dust lanes. Alpha blend is a placeholder; optical depth is TODO(manual). */
export const dustFrag = /* glsl */ `
uniform float uDustDensity;
varying float vAge;
void main() {
  // TODO(manual): dust extinction along spiral arms.
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  if (dot(uv, uv) > 1.0) discard;
  gl_FragColor = vec4(0.35, 0.22, 0.12, uDustDensity * 0.35);
}
`;
