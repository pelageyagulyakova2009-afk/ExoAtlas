/**
 * Ported from: Schlick Fresnel used for water in ZyFou/ProceduralTerrains,
 * and the specular term in dgreenheck/threejs-procedural-planets planet-frag-shader
 * (ogldev tutorial 19, reflection vector).
 * Original authors: Christophe Schlick; David Greenheck (specular wiring).
 * License: MIT (both repositories).
 * Adaptations: F0 = 0.02, shininess 64, specular fades above the shoreline
 * the same way Greenheck fades it above transition3.
 */
export const waterGlsl = /* glsl */ `
float waterFresnel(vec3 normal, vec3 viewDir) {
  float cosTheta = clamp(dot(normal, viewDir), 0.0, 1.0);
  float f0 = 0.02;
  return f0 + (1.0 - f0) * pow(1.0 - cosTheta, 5.0);
}
float waterSpecular(vec3 normal, vec3 viewDir, vec3 sunDir) {
  vec3 R = normalize(reflect(-normalize(sunDir), normal));
  return pow(max(dot(viewDir, R), 0.0), 64.0);
}
`;
