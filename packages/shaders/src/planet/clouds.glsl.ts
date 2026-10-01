/**
 * Two to three volumetric cloud shells.
 * Inspired by dgreenheck/threejs-procedural-planets cloud layer.
 * Ray march and coverage noise are TODO(manual) (R0, R1).
 */
export const cloudsFrag = /* glsl */ `
uniform float uCloudCoverage;
uniform float uTime;
varying vec3 vWorld;
void main() {
  // TODO(manual): 2-3 shell ray march with fbm density.
  float band = 0.5 + 0.5 * vWorld.y;
  float alpha = uCloudCoverage * 0.35 * smoothstep(0.15, 0.8, band);
  gl_FragColor = vec4(vec3(0.9), alpha);
}
`;
