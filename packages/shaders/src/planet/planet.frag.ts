import { nightLightsGlsl } from './night_lights.glsl';
import { simplexGlsl } from './simplex.glsl';
import { waterGlsl } from './water.glsl';

/**
 * Lighting is the ambient + Lambert + height-faded specular from
 * dgreenheck/threejs-procedural-planets planet-frag-shader.
 * Original author: David Greenheck (lighting). Biome colors stay local.
 * License: MIT.
 * Adaptations: when uUseEarth > 0 the albedo is the NASA day map.
 * Procedural covers still follow temperature, moisture, and elevation.
 */
export const planetFrag = /* glsl */ `
uniform float uSeaLevel;
uniform float uTemperature;
uniform float uMoisture;
uniform float uUseEarth;
uniform vec3 uSunDir;
uniform sampler2D uDay;
uniform sampler2D uNight;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vHeight;
varying vec2 vUvSphere;
${simplexGlsl}
${waterGlsl}
${nightLightsGlsl}
void main() {
  vec3 n = normalize(vNormal);
  vec3 sun = normalize(uSunDir);
  float ndl = max(dot(n, sun), 0.0);
  float lat = abs(normalize(vPosition).y);
  vec3 earth = texture2D(uDay, vUvSphere).rgb;
  float temp = clamp(uTemperature * (1.0 - lat * 0.85), 0.0, 1.0);
  float moist = clamp(uMoisture, 0.0, 1.0);
  vec3 deep = vec3(0.02, 0.08, 0.22);
  vec3 shallow = vec3(0.05, 0.45, 0.48);
  vec3 beach = vec3(0.76, 0.7, 0.5);
  vec3 forest = vec3(0.12, 0.32, 0.12);
  vec3 tropics = vec3(0.05, 0.38, 0.16);
  vec3 desert = vec3(0.72, 0.55, 0.28);
  vec3 savanna = vec3(0.55, 0.52, 0.22);
  vec3 tundra = vec3(0.45, 0.48, 0.38);
  vec3 taiga = vec3(0.16, 0.28, 0.18);
  vec3 rock = vec3(0.35, 0.32, 0.3);
  vec3 snow = vec3(0.92, 0.94, 0.96);
  vec3 ice = vec3(0.75, 0.86, 0.92);
  vec3 land = mix(desert, forest, moist);
  land = mix(land, tropics, smoothstep(0.65, 0.9, temp) * moist);
  land = mix(land, savanna, smoothstep(0.45, 0.7, temp) * (1.0 - moist));
  land = mix(land, taiga, smoothstep(0.35, 0.15, temp));
  land = mix(land, tundra, smoothstep(0.22, 0.08, temp));
  land = mix(land, rock, smoothstep(0.02, 0.08, vHeight));
  land = mix(land, snow, smoothstep(0.55, 0.82, lat));
  land = mix(land, snow, smoothstep(0.07, 0.12, vHeight));
  land = mix(land, ice, smoothstep(0.88, 0.98, lat));
  float shore = smoothstep(uSeaLevel - 0.02, uSeaLevel + 0.01, vHeight);
  vec3 ocean = mix(deep, shallow, smoothstep(uSeaLevel - 0.08, uSeaLevel, vHeight));
  vec3 albedo = mix(ocean, land, shore);
  albedo = mix(albedo, beach, (1.0 - shore) * shore * 4.0);
  albedo = mix(albedo, earth, uUseEarth);
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fres = waterFresnel(n, viewDir);
  float spec = waterSpecular(n, viewDir, sun);
  vec3 color = albedo * (0.08 + 0.92 * ndl);
  color = mix(color, vec3(0.45, 0.6, 0.75), fres * (1.0 - shore));
  color += vec3(1.0, 0.95, 0.85) * spec * (1.0 - shore);
  color += nightLights(vPosition, sun, vHeight, vUvSphere);
  gl_FragColor = vec4(color, 1.0);
}
`;
