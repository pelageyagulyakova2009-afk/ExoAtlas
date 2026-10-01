/**
 * Emissive city mask on the night side.
 * TODO(manual): mask from moisture/height and sun terminator (R0).
 */
export const nightLightsGlsl = /* glsl */ `
vec3 nightLights(vec3 position, vec3 sunDir, float height) {
  // TODO(manual): emissive mask where dot(position, sunDir) < 0.
  return vec3(0.0);
}
`;
