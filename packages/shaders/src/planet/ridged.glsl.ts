/**
 * Ported from: fractal3 and terrainHeight (type 3, ridged) in
 * dgreenheck/threejs-procedural-planets index.html noise-functions.
 * Original author: David Greenheck.
 * License: MIT.
 * Adaptations: fixed Earth-like constants instead of the UI uniforms
 * (amplitude, sharpness, period, persistence, lacunarity, octaves).
 * Octaves capped at 6 so the loop stays static for WebGL1.
 */
export const ridgedGlsl = /* glsl */ `
float fractal3(vec3 v, float period, float persistence, float lacunarity) {
  float n = 0.0;
  float a = 1.0;
  float maxAmp = 0.0;
  float P = period;
  for (int i = 0; i < 6; i++) {
    n += a * simplex3(v / P);
    a *= persistence;
    maxAmp += a;
    P /= lacunarity;
  }
  return n / maxAmp;
}
float terrainHeight(vec3 v) {
  float h = fractal3(v, 0.45, 0.5, 2.0);
  h = 0.09 * pow(max(0.0, 1.0 - abs(h)), 2.2);
  return max(0.0, h - 0.012);
}
float ridged(vec3 p) {
  return terrainHeight(p);
}
`;
