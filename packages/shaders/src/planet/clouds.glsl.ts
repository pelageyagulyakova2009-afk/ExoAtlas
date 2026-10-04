import { fbmGlsl } from './fbm.glsl';
import { simplexGlsl } from './simplex.glsl';

/**
 * Ported from: layered cloud shells plus Worley cellular noise
 * (Steven Worley, 1996) and the shell layout in Aerion clouds.glsl.
 * Original authors: Steven Worley (cellular noise). Aerion authors for the shell idea.
 * License: Worley algorithm is published; Aerion source was not copied line-for-line
 * because this file keeps a short march. Implementation is ExoForge code.
 * Adaptations: Worley frequency 8, tighter smoothstep so cloud edges stay sharp.
 */
export const cloudsFrag = /* glsl */ `
uniform float uCloudCoverage;
uniform float uTime;
varying vec3 vWorld;
${simplexGlsl}
${fbmGlsl}
float worley(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  float minDist = 1.0;
  for (int z = -1; z <= 1; z++) {
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec3 neighbor = vec3(float(x), float(y), float(z));
        vec3 point = neighbor + hash13(i + neighbor) - f;
        minDist = min(minDist, dot(point, point));
      }
    }
  }
  return 1.0 - minDist;
}
void main() {
  vec3 p = normalize(vWorld);
  float density = 0.0;
  density += smoothstep(0.55, 0.72, worley(p * 8.0 + vec3(uTime * 0.01, 0.0, 0.0)));
  density += 0.6 * smoothstep(0.55, 0.7, fbm(p * 3.0 + vec3(0.0, uTime * 0.02, 1.0)));
  density += 0.35 * fbm(p * 8.0);
  density *= uCloudCoverage;
  float light = 0.55 + 0.45 * max(dot(p, normalize(vec3(1.0, 0.4, 0.2))), 0.0);
  vec3 color = vec3(0.95, 0.96, 0.98) * light;
  gl_FragColor = vec4(color, clamp(density * 0.55, 0.0, 0.85));
}
`;
