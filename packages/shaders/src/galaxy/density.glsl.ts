/**
 * Density-wave spiral.
 * Lin & Shu 1964, "On the Spiral Structure of Disk Galaxies".
 * Inspired by sugaith/react-three-fiber-shader-galaxy (particle layout)
 * and N0rvel/galaxy_sim (disk kinematics, not copied).
 * The dispersion relation is TODO(manual) (R1).
 */
export const densityWaveGlsl = /* glsl */ `
float armDensity(vec2 disk, float arms, float pitch) {
  // TODO(manual): logarithmic spiral phase from Lin-Shu density wave.
  return 0.0;
}
`;
