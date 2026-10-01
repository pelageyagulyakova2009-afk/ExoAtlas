/**
 * Ported from: Schlick's Fresnel approximation (Christophe Schlick, 1994).
 * Original author: Christophe Schlick
 * License: published reflectance model.
 * Adaptations: F0 = 0.02 for water, Blinn-Phong specular.
 */
export const waterGlsl = /* glsl */ `
float waterFresnel(vec3 normal, vec3 viewDir) {
  float cosTheta = clamp(dot(normal, viewDir), 0.0, 1.0);
  float f0 = 0.02;
  return f0 + (1.0 - f0) * pow(1.0 - cosTheta, 5.0);
}
float waterSpecular(vec3 normal, vec3 viewDir, vec3 sunDir) {
  vec3 h = normalize(sunDir + viewDir);
  return pow(max(dot(normal, h), 0.0), 80.0);
}
`;
