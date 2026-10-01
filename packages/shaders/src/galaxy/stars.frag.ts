/** Age-to-color mapping is TODO(manual). */
export const starsFrag = /* glsl */ `
varying float vAge;
void main() {
  // TODO(manual): blackbody-ish color from stellar age.
  vec3 young = vec3(0.7, 0.8, 1.0);
  vec3 old = vec3(1.0, 0.75, 0.45);
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  if (dot(uv, uv) > 1.0) discard;
  gl_FragColor = vec4(mix(young, old, vAge), 0.9);
}
`;
