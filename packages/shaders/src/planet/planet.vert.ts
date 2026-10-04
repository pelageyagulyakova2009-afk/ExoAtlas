import { domainWarpGlsl } from './domain_warp.glsl';
import { fbmGlsl } from './fbm.glsl';
import { normalGlsl } from './normal.glsl';
import { ridgedGlsl } from './ridged.glsl';
import { simplexGlsl } from './simplex.glsl';

/**
 * Ported from: RidgedNoise displacement in NVB9ALT GradientNoise.js
 * and domain warping as used for continents in ZyFou/ProceduralTerrains.
 * Original authors: NVB9ALT; ZyFou (warp on the sphere).
 * License: MIT.
 * Adaptations: warp then ridged height along the cube-sphere normal.
 * uSeaLevel flattens everything below the shoreline.
 */
export const planetVert = /* glsl */ `
uniform float uSeaLevel;
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vHeight;
varying vec2 vUvSphere;
${simplexGlsl}
${fbmGlsl}
${domainWarpGlsl}
${ridgedGlsl}
float heightField(vec3 p) {
  vec3 q = domainWarp(p * 1.4);
  return ridgedNoise(q) * 0.08;
}
${normalGlsl}
void main() {
  vec3 p = normalize(position);
  float h = heightField(p);
  float land = max(h - uSeaLevel * 0.06, 0.0);
  vec3 displaced = p * (1.0 + land);
  vHeight = h;
  vPosition = displaced;
  vNormal = analyticNormal(p);
  vUvSphere = vec2(atan(p.z, p.x) / 6.2831853 + 0.5, asin(clamp(p.y, -1.0, 1.0)) / 3.1415926 + 0.5);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;
