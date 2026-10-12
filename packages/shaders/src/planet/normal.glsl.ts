/**
 * Ported from: bump normals in dgreenheck/threejs-procedural-planets
 * planet-frag-shader (height samples offset along tangent) and
 * getNormal in NVB9ALT GradientNoise.js (finite difference of the noise).
 * Original authors: David Greenheck; NVB9ALT.
 * License: MIT.
 * Adaptations: three central-difference taps of heightField on the sphere.
 * No baked normal attribute.
 */
export const normalGlsl = /* glsl */ `
vec3 analyticNormal(vec3 p) {
  float e = 0.002;
  float h = heightField(p);
  float hx = heightField(normalize(p + vec3(e, 0.0, 0.0)));
  float hy = heightField(normalize(p + vec3(0.0, e, 0.0)));
  float hz = heightField(normalize(p + vec3(0.0, 0.0, e)));
  return normalize(p + vec3(h - hx, h - hy, h - hz) * 4.0);
}
`;
