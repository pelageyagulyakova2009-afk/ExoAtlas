/**
 * Ported from: central-difference normals on a scalar field (standard calculus).
 * Original author: n/a (finite differences).
 * License: mathematical identity.
 * Adaptations: 3 taps of heightField, epsilon 0.001 so high octaves survive.
 */
export const normalGlsl = /* glsl */ `
vec3 analyticNormal(vec3 p) {
  float e = 0.001;
  float h = heightField(p);
  float hx = heightField(normalize(p + vec3(e, 0.0, 0.0)));
  float hy = heightField(normalize(p + vec3(0.0, e, 0.0)));
  float hz = heightField(normalize(p + vec3(0.0, 0.0, e)));
  return normalize(vec3(h - hx, h - hy, h - hz) + p);
}
`;
