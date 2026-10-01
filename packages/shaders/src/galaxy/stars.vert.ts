import { densityWaveGlsl } from './density.glsl';

/** Star color by age is TODO(manual). Positions are uploaded from the CPU. */
export const starsVert = /* glsl */ `
attribute float aAge;
varying float vAge;
${densityWaveGlsl}
void main() {
  vAge = aAge;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 1.6 * (8.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;
