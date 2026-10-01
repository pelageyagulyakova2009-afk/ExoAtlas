/**
 * Ported from: night-side city lights idea used with NASA Black Marble / Earth at night.
 * Original author: NASA Earth Observatory (imagery). Mask math is ExoForge code.
 * License: NASA imagery is public domain; this function is ExoForge code.
 * Adaptations: texture when uUseEarth > 0, otherwise a coastal/mid-latitude mask.
 */
export const nightLightsGlsl = /* glsl */ `
vec3 nightLights(vec3 position, vec3 sunDir, float height, vec2 uv) {
  float night = smoothstep(0.15, -0.15, dot(normalize(position), sunDir));
  vec3 cities = texture2D(uNight, uv).rgb;
  float procedural = smoothstep(uSeaLevel, uSeaLevel + 0.02, height);
  procedural *= smoothstep(0.75, 0.35, abs(normalize(position).y));
  procedural *= step(0.62, simplexNoise(position * 18.0));
  vec3 mask = mix(vec3(procedural), cities, uUseEarth);
  return mask * night * vec3(1.0, 0.82, 0.45);
}
`;
