/**
 * Ported from: Lin & Shu 1964, logarithmic spiral phase ln(r) / tan(pitch).
 * The numeric form used on the CPU is armAngle() in galaxy.ts.
 * Original authors: C.C. Lin, Frank Shu.
 * License: published theory.
 * Adaptations: GLSL twin of the CPU phase, kept for the shader pack.
 */
export const densityWaveGlsl = /* glsl */ `
float armDensity(vec2 disk, float arms, float pitch) {
  float radius = max(length(disk), 0.02);
  float theta = atan(disk.y, disk.x);
  float phase = theta - log(radius) / max(tan(pitch), 0.05);
  float arm = cos(phase * arms);
  return arm * arm;
}
`;
