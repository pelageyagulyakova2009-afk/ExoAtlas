/**
 * Ported from: Beer-Lambert transmittance and Henyey-Greenstein in
 * CK42BB/procedural-clouds-threejs cloud-shaders.md.
 * Original author: CK42BB.
 * License: MIT.
 * Adaptations: one shell on the unit sphere, 1 sample of fbm density.
 * Alpha is the density itself. Empty space stays transparent so the
 * disc is never painted black. Specular brightens the sun-facing side.
 */
export const cloudsFrag = /* glsl */ `
uniform float uCloudCoverage;
uniform float uTime;
varying vec3 vWorld;
float hash(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}
float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
float fbm(vec3 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return s;
}
float hg(float mu) {
  float g = 0.6;
  float g2 = g * g;
  return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * mu, 1.5);
}
void main() {
  vec3 p = normalize(vWorld);
  vec3 sun = normalize(vec3(1.0, 0.35, 0.15));
  float n = fbm(p * 4.0 + vec3(uTime * 0.02, 0.0, 0.4));
  float threshold = mix(0.72, 0.42, clamp(uCloudCoverage, 0.0, 1.0));
  float density = smoothstep(threshold, threshold + 0.12, n) * uCloudCoverage;
  float beer = exp(-density * 1.2);
  float mu = dot(p, sun);
  float light = beer * (0.45 + 0.55 * smoothstep(-0.2, 0.6, mu)) * hg(mu);
  vec3 color = vec3(0.95, 0.97, 1.0) * light;
  if (density < 0.02) discard;
  gl_FragColor = vec4(color, clamp(density * 0.85, 0.0, 0.8));
}
`;
