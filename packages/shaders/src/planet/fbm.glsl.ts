/**
 * Ported from: Inigo Quilez, "Fractional Brownian motion"
 * https://iquilezles.org/articles/fbm/
 * Original author: Inigo Quilez
 * License: published article; this sum is ExoForge code.
 * Adaptations: 5 octaves, lacunarity 2, gain 0.5.
 */
export const fbmGlsl = /* glsl */ `
float fbm(vec3 p) {
  float sum = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 5; i++) {
    sum += amp * simplexNoise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return sum;
}
`;
