/**
 * Ported from: the soft star sprite in dgreenheck/webgpu-galaxy
 * (gaussian falloff, additive color).
 * Original author: David Greenheck.
 * License: MIT. WebGL point-coord rewrite of the TSL sprite.
 * Adaptations: no bloom pass. Core is a tight gaussian so points stay hard
 * enough to read at 100k without a postprocess.
 */
export const starsFrag = /* glsl */ `
varying vec3 vColor;
void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float d = dot(uv, uv);
  if (d > 1.0) discard;
  float alpha = exp(-d * 4.5);
  gl_FragColor = vec4(vColor * alpha, alpha);
}
`;
