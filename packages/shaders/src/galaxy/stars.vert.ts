/**
 * Ported from: the star point size in dgreenheck/webgpu-galaxy (points that
 * stay small in screen space and brighten toward the camera).
 * Original author: David Greenheck.
 * License: MIT. This is a WebGL rewrite, not the TSL material.
 * Adaptations: gl_PointSize from view depth. No WebGPU storage buffers.
 */
export const starsVert = /* glsl */ `
attribute vec3 aColor;
varying vec3 vColor;
void main() {
  vColor = aColor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = clamp(2.4 * (2.2 / -mv.z), 1.0, 6.0);
  gl_Position = projectionMatrix * mv;
}
`;
