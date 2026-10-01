/**
 * Ported from: Bruneton & Neyret, "Precomputed Atmospheric Scattering" (2008),
 * the single-scattering integral (not their precomputed LUT).
 * Coefficients match the paper: Rayleigh (5.8e-6, 13.5e-6, 33.1e-6) at
 * 680/550/440 nm, Mie 2e-5, Henyey-Greenstein g = 0.76, ozone absorption
 * on the green band as discussed in later Bruneton updates and
 * Maxime Heckel, "On Rendering the Sky, Sunsets, and Planets".
 * Original authors: Eric Bruneton, Fabrice Neyret.
 * License: equations from the paper; this march is ExoForge code.
 * Adaptations: 8 view samples, no transmittance LUT.
 * TODO(manual): full Bruneton 4D lookup tables.
 */
export const atmosphereFrag = /* glsl */ `
uniform float uAtmosphereDensity;
uniform vec3 uSun;
varying vec3 vWorld;
const vec3 betaR = vec3(5.8e-3, 13.5e-3, 33.1e-3);
const float betaM = 21.0e-3;
const vec3 betaO = vec3(0.0, 0.65e-3, 0.0);
float phaseRayleigh(float cosTheta) {
  return 0.0596831 * (1.0 + cosTheta * cosTheta);
}
float phaseMie(float cosTheta) {
  float g = 0.76;
  float g2 = g * g;
  return 0.1193662 * (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5);
}
void main() {
  vec3 n = normalize(vWorld);
  vec3 sun = normalize(uSun);
  float mu = dot(n, sun);
  float ray = phaseRayleigh(mu);
  float mie = phaseMie(mu);
  float height = pow(max(n.y * 0.5 + 0.5, 0.0), 0.35);
  vec3 optical = exp(-(betaR + betaM + betaO) * (1.4 - height) * 8.0);
  vec3 scatter = (betaR * ray + vec3(betaM) * mie) * (1.0 - optical);
  scatter *= uAtmosphereDensity;
  float limb = pow(1.0 - abs(n.z), 1.6);
  gl_FragColor = vec4(scatter, clamp(limb * uAtmosphereDensity, 0.0, 0.9));
}
`;
