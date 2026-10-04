/**
 * Ported from: single-scattering Rayleigh and Mie phases in
 * jeantimex/precomputed_atmospheric_scattering (Bruneton & Neyret 2008),
 * without the precomputed 4D lookup tables.
 * Original authors: Eric Bruneton, Fabrice Neyret; jeantimex (WebGL port).
 * License: MIT (jeantimex). Equations from the 2008 paper.
 * Adaptations: back-face shell, 8 view samples, Fresnel rim so the limb
 * stays visible from the default camera. uAtmosphereDensity scales
 * optical depth. No megabyte transmittance LUT.
 */
export const atmosphereFrag = /* glsl */ `
uniform float uAtmosphereDensity;
uniform vec3 uSun;
varying vec3 vWorld;
const float PI = 3.14159265;
float rayleighPhase(float mu) {
  return 3.0 / (16.0 * PI) * (1.0 + mu * mu);
}
float miePhase(float mu) {
  float g = 0.76;
  float g2 = g * g;
  return 3.0 / (8.0 * PI) * ((1.0 - g2) * (1.0 + mu * mu)) / ((2.0 + g2) * pow(1.0 + g2 - 2.0 * g * mu, 1.5));
}
void main() {
  vec3 n = normalize(vWorld);
  vec3 view = normalize(cameraPosition - vWorld);
  vec3 sun = normalize(uSun);
  float mu = dot(view, sun);
  float rim = pow(1.0 - abs(dot(n, view)), 2.4);
  float density = uAtmosphereDensity;
  vec3 betaR = vec3(5.8, 13.5, 33.1) * 0.02 * density;
  float betaM = 2.1 * 0.02 * density;
  vec3 scatter = vec3(0.0);
  float opticalR = 0.0;
  float opticalM = 0.0;
  for (int i = 0; i < 8; i++) {
    float t = (float(i) + 0.5) / 8.0;
    float height = t;
    float od = exp(-height * 4.0) * density;
    opticalR += od;
    opticalM += od * 0.8;
    vec3 attn = exp(-(betaR * opticalR + vec3(betaM * opticalM)));
    scatter += attn * od;
  }
  vec3 color = scatter * (betaR * rayleighPhase(mu) + vec3(betaM) * miePhase(mu));
  color *= 1.0 + rim * 2.5;
  float alpha = clamp(rim * density * 1.4 + max(color.b, 0.0), 0.0, 0.85);
  gl_FragColor = vec4(color * 4.0, alpha);
}
`;
