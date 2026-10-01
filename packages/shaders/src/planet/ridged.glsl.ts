/**
 * Ported from: ridged multifractal as described by F.K. Musgrave and summarized
 * alongside Inigo Quilez derivative noise: https://iquilezles.org/articles/morenoise/
 * Original author: Ken Musgrave (ridge), Inigo Quilez (article)
 * License: published descriptions; this loop is ExoForge code.
 * Adaptations: ridge = 1 - abs(noise), squared, 5 octaves. Not derivative morenoise.
 * TODO(manual): hydraulic erosion. No permissive single-file port was vendored.
 */
export const ridgedGlsl = /* glsl */ `
float ridged(vec3 p) {
  float sum = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 5; i++) {
    float n = 1.0 - abs(simplexNoise(p * freq) * 2.0 - 1.0);
    sum += n * n * amp;
    freq *= 2.05;
    amp *= 0.5;
  }
  return sum;
}
`;
