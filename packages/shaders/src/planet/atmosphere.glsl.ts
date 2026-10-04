/**
 * Ported from: Bruneton & Neyret, "Precomputed Atmospheric Scattering" (2008),
 * the single-scattering integral (not their precomputed LUT).
 * Coefficients match the paper: Rayleigh (5.8e-6, 13.5e-6, 33.1e-6) at
 * 680/550/440 nm, Mie 2e-5, Henyey-Greenstein g = 0.76, ozone absorption
 * on the green band as discussed in later Bruneton updates and
 * Maxime Heckel, "On Rendering the Sky, Sunsets, and Planets".
 * Original authors: Eric Bruneton, Fabrice Neyret.
 * License: equations from the paper; this march is ExoForge code.
 * Adaptations: 16 samples along the view ray, no transmittance LUT.
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
  vec3 rd = normalize(vWorld - cameraPosition);
  vec3 sun = normalize(uSun);
  float mu = dot(rd, sun);
  float ray = phaseRayleigh(mu);
  float mie = phaseMie(mu);
  vec3 scatter = vec3(0.0);
  vec3 transmit = vec3(1.0);
  const int STEPS = 16;
  float dt = 0.2 / float(STEPS);
  for (int i = 0; i < STEPS; i++) {
    vec3 p = mix(cameraPosition, vWorld, float(i) / float(STEPS - 1));
    float height = max(length(p) - 1.0, 0.0);
    float dens = exp(-height * 14.0) * uAtmosphereDensity;
    vec3 stepBeta = (betaR + vec3(betaM) + betaO) * dens;
    transmit *= exp(-stepBeta * dt);
    scatter += transmit * dens * (betaR * ray + vec3(betaM) * mie) * dt;
  }
  float alpha = clamp(1.0 - transmit.b, 0.0, 0.9);
  gl_FragColor = vec4(scatter * 4.0, alpha);
}
`;
