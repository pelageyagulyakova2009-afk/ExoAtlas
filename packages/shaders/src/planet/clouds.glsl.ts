/**
 * Ported from: volumetric ray march, Beer-Lambert, and Henyey-Greenstein in
 * CK42BB/procedural-clouds-threejs cloud-shaders.md (volumetric_clouds.frag).
 * Original author: CK42BB.
 * License: MIT.
 * Adaptations: the march is a short shell around a unit sphere (24 steps,
 * 4 light steps) instead of a fullscreen sky. Coverage is uCloudCoverage.
 * Noise is the value-noise fbm from that file, not Worley.
 */
export const cloudsFrag = /* glsl */ `
uniform float uCloudCoverage;
uniform float uTime;
varying vec3 vWorld;
vec3 hash3(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453);
}
float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(dot(hash3(i), f), dot(hash3(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), f.x),
        mix(dot(hash3(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)), dot(hash3(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(dot(hash3(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)), dot(hash3(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)), f.x),
        mix(dot(hash3(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)), dot(hash3(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}
float cloudFbm(vec3 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += noise3D(p) * amp;
    p *= 2.0;
    amp *= 0.5;
  }
  return sum;
}
float henyeyGreenstein(float cosTheta, float g) {
  float g2 = g * g;
  return (1.0 - g2) / (4.0 * 3.14159265 * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5));
}
float cloudDensity(vec3 p) {
  float h = length(p) - 1.015;
  float shell = smoothstep(0.0, 0.012, h) * smoothstep(0.035, 0.012, h);
  float n = cloudFbm(p * 3.5 + vec3(uTime * 0.01, 0.0, 0.0));
  return shell * smoothstep(0.55 - uCloudCoverage * 0.25, 0.72, n) * uCloudCoverage;
}
void main() {
  vec3 ro = cameraPosition;
  vec3 rd = normalize(vWorld - cameraPosition);
  float t = max(length(ro) - 1.06, 0.0);
  vec3 sun = normalize(vec3(1.0, 0.35, 0.15));
  float trans = 1.0;
  vec3 scatter = vec3(0.0);
  float phase = henyeyGreenstein(dot(rd, sun), 0.6);
  for (int i = 0; i < 24; i++) {
    vec3 pos = ro + rd * t;
    float d = cloudDensity(pos);
    if (d > 0.001) {
      float light = 0.0;
      vec3 lp = pos;
      for (int j = 0; j < 4; j++) {
        lp += sun * 0.01;
        light += cloudDensity(lp);
      }
      float beer = exp(-light * 1.4) * exp(-d * 0.08);
      scatter += trans * d * beer * phase * vec3(1.0, 0.98, 0.95);
      trans *= exp(-d * 0.12);
    }
    t += 0.012;
    if (trans < 0.05 || length(pos) < 0.99) break;
  }
  gl_FragColor = vec4(scatter, clamp(1.0 - trans, 0.0, 0.9));
}
`;
