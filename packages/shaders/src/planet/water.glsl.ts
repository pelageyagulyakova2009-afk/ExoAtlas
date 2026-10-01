/**
 * Fresnel water and specular.
 * Inspired by ZyFou/ProceduralTerrains water shading.
 * TODO(manual): Schlick Fresnel and sun specular (R0).
 */
export const waterGlsl = /* glsl */ `
float waterShade(vec3 normal, vec3 viewDir, vec3 sunDir) {
  // TODO(manual): Fresnel + specular.
  return 0.0;
}
`;
