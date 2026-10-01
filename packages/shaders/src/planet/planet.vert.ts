import { fbmGlsl } from './fbm.glsl';
import { ridgedGlsl } from './ridged.glsl';
import { simplexGlsl } from './simplex.glsl';

/**
 * Vertex displacement from a procedural heightmap.
 * Inspired by ZyFou/ProceduralTerrains cube-sphere displacement.
 * Analytic normals from the height field are TODO(manual) (R0).
 */
export const planetVert = /* glsl */ `
uniform float uSeaLevel;
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vHeight;
${simplexGlsl}
${fbmGlsl}
${ridgedGlsl}
void main() {
  vec3 p = normalize(position);
  // TODO(manual): height = fbm + ridged, displace along analytic normal.
  float height = 0.0;
  vHeight = height;
  vPosition = p;
  vNormal = p;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;
