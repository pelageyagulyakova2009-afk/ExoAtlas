import { nightLightsGlsl } from './night_lights.glsl';
import { simplexGlsl } from './simplex.glsl';
import { waterGlsl } from './water.glsl';

/**
 * Ported from: day/night lighting in SkyeShark/Eanpa-Sky and the
 * layered material mix in NVB9ALT materials.js.
 * Original authors: SkyeShark; NVB9ALT.
 * License: MIT.
 * Adaptations: terminator is smoothstep on dot(normal, sun).
 * Cold ambient stands in for sky scatter. Specular only on water.
 * NASA day map replaces the biome stack when uUseEarth > 0.5.
 * Fifteen biome mixes run only for procedural planets.
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
  vec3 geo = normalize(vPosition);
  vec3 n = normalize(mix(geo, normalize(vNormal), 0.2));
  vec3 sun = normalize(uSunDir);
  float ndl = dot(geo, sun);
  float day = smoothstep(-0.15, 0.25, ndl);
  vec3 ambient = vec3(0.16, 0.2, 0.28);
  float lat = abs(normalize(vPosition).y);
  float temp = clamp(uTemperature * (1.0 - lat * 0.75) + (1.0 - lat) * 0.15, 0.0, 1.0);
  float moist = clamp(uMoisture, 0.0, 1.0);
  float h = vHeight;
  vec3 ocean = mix(vec3(0.02, 0.06, 0.18), vec3(0.05, 0.35, 0.42), smoothstep(0.0, uSeaLevel + 0.02, h));
  vec3 coast = vec3(0.76, 0.68, 0.45);
  vec3 desert = vec3(0.72, 0.52, 0.26);
  vec3 savanna = vec3(0.55, 0.5, 0.2);
  vec3 grassland = vec3(0.35, 0.48, 0.18);
  vec3 forest = vec3(0.1, 0.32, 0.12);
  vec3 rainforest = vec3(0.04, 0.28, 0.1);
  vec3 taiga = vec3(0.16, 0.26, 0.16);
  vec3 tundra = vec3(0.45, 0.48, 0.4);
  vec3 rock = vec3(0.35, 0.32, 0.28);
  vec3 snow = vec3(0.92, 0.94, 0.96);
  vec3 ice = vec3(0.75, 0.88, 0.95);
  vec3 steppe = vec3(0.62, 0.55, 0.32);
  vec3 marsh = vec3(0.2, 0.32, 0.22);
  vec3 scrub = vec3(0.4, 0.38, 0.22);
  vec3 alpine = vec3(0.55, 0.58, 0.6);
  vec3 land = desert;
  land = mix(land, steppe, smoothstep(0.15, 0.35, moist));
  land = mix(land, savanna, smoothstep(0.35, 0.55, temp) * moist);
  land = mix(land, grassland, smoothstep(0.25, 0.5, moist) * smoothstep(0.7, 0.4, temp));
  land = mix(land, scrub, smoothstep(0.2, 0.45, moist) * (1.0 - temp));
  land = mix(land, forest, smoothstep(0.45, 0.7, moist) * smoothstep(0.25, 0.55, temp));
  land = mix(land, rainforest, smoothstep(0.7, 0.95, moist) * smoothstep(0.6, 0.9, temp));
  land = mix(land, marsh, smoothstep(0.8, 1.0, moist) * smoothstep(0.4, 0.6, temp));
  land = mix(land, taiga, smoothstep(0.35, 0.15, temp));
  land = mix(land, tundra, smoothstep(0.2, 0.05, temp));
  land = mix(land, rock, smoothstep(0.045, 0.07, h));
  land = mix(land, alpine, smoothstep(0.055, 0.08, h) * (1.0 - temp));
  land = mix(land, snow, smoothstep(0.06, 0.09, h));
  land = mix(land, snow, smoothstep(0.72, 0.9, lat));
  land = mix(land, ice, smoothstep(0.9, 0.98, lat));
  float shore = smoothstep(uSeaLevel * 0.06 - 0.005, uSeaLevel * 0.06 + 0.008, h);
  vec3 albedo = mix(ocean, land, shore);
  albedo = mix(albedo, coast, shore * (1.0 - shore) * 4.0);
  vec3 earth = texture2D(uDay, vUvSphere).rgb;
  albedo = mix(albedo, earth * 1.35, step(0.5, uUseEarth));
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float waterMask = (1.0 - shore) * (1.0 - step(0.5, uUseEarth));
  float spec = waterSpecular(n, viewDir, sun) * waterMask * day;
  vec3 color = albedo * (ambient + vec3(1.05) * day);
  color = mix(color, earth * (0.35 + 0.95 * day), step(0.5, uUseEarth));
  color += vec3(1.0, 0.95, 0.85) * spec * 0.65;
  color += nightLights(vPosition, sun, h, vUvSphere) * (1.0 - day);
  gl_FragColor = vec4(color, 1.0);
}
`;
