/**
 * Ported from: RidgedNoise in NVB9ALT/NVB9ALT.github.io js/GradientNoise.js.
 * Original author: NVB9ALT.
 * License: MIT.
 * Adaptations: the base noise is simplex3 already in this package.
 * Levels are 6 (their default is 16, too heavy per vertex on a cube-sphere).
 * Domain warp of the sample point is applied by the caller.
 */
export const ridgedGlsl = /* glsl */ `
float ridgedNoise(vec3 p) {
  float c = 0.0;
  float weight = 1.0;
  float gain = 2.0;
  float amp = 0.5;
  float res = 1.6;
  for (int l = 0; l < 6; l++) {
    res *= 2.0;
    float noise = simplex3(p * res) * 0.5 + 0.5;
    noise = abs(noise * 2.0 - 1.0);
    noise = 1.0 - noise;
    noise *= noise;
    noise *= weight;
    weight = clamp(noise * gain, 0.0, 1.0);
    c += noise * amp;
    amp /= 2.0;
  }
  return c;
}
`;
