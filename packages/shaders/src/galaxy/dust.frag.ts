/**
 * Ported from: the dark dust cloud sprites in dgreenheck/webgpu-galaxy.
 * Original author: David Greenheck.
 * License: MIT. WebGL point rewrite; their cloud is a textured plane.
 * Adaptations: multiply-blend brown discs, coverage from uDustDensity.
 * No WebGPU compute advection.
 */
export const dustFrag = /* glsl */ `
uniform float uDustDensity;
void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float d = dot(uv, uv);
  if (d > 1.0) discard;
  float alpha = exp(-d * 2.2) * 0.55 * uDustDensity;
  gl_FragColor = vec4(0.08, 0.05, 0.03, alpha);
}
`;
