import { domainWarpGlsl } from './domain_warp.glsl';
import { fbmGlsl } from './fbm.glsl';
import { normalGlsl } from './normal.glsl';
import { ridgedGlsl } from './ridged.glsl';
import { simplexGlsl } from './simplex.glsl';

/**
 * Ported from: vertex displacement along the sphere normal, as in
 * dgreenheck/threejs-procedural-planets.
 * Original author: David Greenheck (structure). Height mix is ExoForge.
 * License: repository layout idea; formula assembled from the noise ports above.
 * Adaptations: domain-warped continents plus ridged mountains, analytic normal.
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
${ridgedGlsl}
${domainWarpGlsl}
float heightField(vec3 p) {
  vec3 q = domainWarp(p * 1.7);
  float continents = fbm(q) - 0.35;
  float mountains = ridged(p * 3.5);
  return continents * 0.12 + mountains * 0.045;
}
${normalGlsl}
void main() {
  vec3 p = normalize(position);
  float h = heightField(p);
  vec3 displaced = p * (1.0 + max(h - uSeaLevel * 0.05, 0.0));
  vHeight = h;
  vPosition = displaced;
  vNormal = analyticNormal(p);
  vUvSphere = vec2(atan(p.z, p.x) / 6.2831853 + 0.5, asin(clamp(p.y, -1.0, 1.0)) / 3.1415926 + 0.5);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;
