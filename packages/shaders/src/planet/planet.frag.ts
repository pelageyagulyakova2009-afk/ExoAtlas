/**
 * Biomes from temperature, moisture, and height.
 * Inspired by ZyFou/ProceduralTerrains biome bands.
 * Blend weights are TODO(manual) (R0). Ocean / forest / desert / ice / tundra.
 */
export const planetFrag = /* glsl */ `
uniform float uSeaLevel;
uniform float uTemperature;
uniform float uMoisture;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vHeight;
void main() {
  // TODO(manual): Whittaker-style biome mix. Placeholder latitude tint only.
  float lat = abs(normalize(vPosition).y);
  vec3 ocean = vec3(0.05, 0.18, 0.35);
  vec3 ice = vec3(0.85, 0.9, 0.95);
  vec3 land = mix(vec3(0.15, 0.35, 0.16), vec3(0.55, 0.42, 0.22), uTemperature);
  land = mix(land, vec3(0.35, 0.4, 0.28), uMoisture * 0.3);
  vec3 color = mix(land, ice, smoothstep(0.72, 0.92, lat));
  if (vHeight < uSeaLevel) color = ocean;
  gl_FragColor = vec4(color, 1.0);
}
`;
