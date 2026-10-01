/**
 * Rayleigh + Mie spherical ray march.
 * Inspired by binaryfoundry/atmospheric-scattering and
 * Eric Bruneton, "Precomputed Atmospheric Scattering" (2008).
 * https://ebruneton.github.io/precomputed_atmospheric_scattering/
 * Formulas are TODO(manual) (R1).
 */
export const atmosphereFrag = /* glsl */ `
uniform float uAtmosphereDensity;
uniform vec3 uSun;
varying vec3 vWorld;
void main() {
  // TODO(manual): ray-sphere intersection, Rayleigh/Mie optical depth, phase functions.
  float fres = pow(1.0 - abs(dot(normalize(vWorld), vec3(0.0, 0.0, 1.0))), 2.0);
  vec3 scatter = vec3(0.35, 0.55, 0.95) * uAtmosphereDensity * fres;
  gl_FragColor = vec4(scatter, clamp(fres * uAtmosphereDensity, 0.0, 0.85));
}
`;
