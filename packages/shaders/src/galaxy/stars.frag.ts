/**
 * Ported from: stellar color already computed on the CPU via Tanner Helland.
 * Original author: Tanner Helland (CPU). This fragment only draws the point sprite.
 * License: approximation is published on his site; shader is ExoForge code.
 * Adaptations: hard core, alpha falls off only at the rim.
 */
export const starsFrag = /* glsl */ `
varying vec3 vColor;
void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float d = dot(uv, uv);
  if (d > 1.0) discard;
  float core = smoothstep(1.0, 0.35, d);
  gl_FragColor = vec4(vColor, core);
}
`;
