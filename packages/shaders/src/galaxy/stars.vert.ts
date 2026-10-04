/**
 * Point size falls with view depth.
 * Ported from: the particle vertex stage in sugaith/react-three-fiber-shader-galaxy.
 * Original author: sugaith (structure).
 * License: idea only; this shader is ExoForge code.
 * Adaptations: smaller attenuated points so stars stay separate.
 */
export const starsVert = /* glsl */ `
attribute vec3 aColor;
varying vec3 vColor;
void main() {
  vColor = aColor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 1.2 * (4.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;
