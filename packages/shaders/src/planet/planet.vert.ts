import { normalGlsl } from './normal.glsl';
import { ridgedGlsl } from './ridged.glsl';
import { simplexGlsl } from './simplex.glsl';

/**
 * Ported from: planet-vert-shader in dgreenheck/threejs-procedural-planets.
 * Original author: David Greenheck.
 * License: MIT.
 * Adaptations: displacement is terrainHeight along the cube-sphere normal.
 * Sea level still comes from uSeaLevel. Analytic normal stays local.
 */
export const planetVert = /* glsl */ `
uniform float uSeaLevel;
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vHeight;
varying vec2 vUvSphere;
${simplexGlsl}
${ridgedGlsl}
float heightField(vec3 p) {
  return terrainHeight(p * 2.2);
}
${normalGlsl}
void main() {
  vec3 p = normalize(position);
  float h = heightField(p);
  vec3 displaced = p * (1.0 + max(h - uSeaLevel * 0.04, 0.0));
  vHeight = h;
  vPosition = displaced;
  vNormal = analyticNormal(p);
  vUvSphere = vec2(atan(p.z, p.x) / 6.2831853 + 0.5, asin(clamp(p.y, -1.0, 1.0)) / 3.1415926 + 0.5);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;
