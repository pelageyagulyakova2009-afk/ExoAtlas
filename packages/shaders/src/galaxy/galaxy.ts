/**
 * Logarithmic spiral disk.
 * Ported from: Lin & Shu 1964 density-wave phase, theta = ln(r) / tan(pitch).
 * Star colors follow the blackbody split used by dgreenheck/webgpu-galaxy
 * (hot blue arms, warm core). Positions are not copied from beltoforion.
 * Original authors: C.C. Lin, Frank Shu. David Greenheck (color split).
 * License: the 1964 equation is the scientific source. webgpu-galaxy is MIT;
 * this sampler is a WebGL rewrite, not their TSL compute shaders.
 * Adaptations: exponential radius pdf, bar as a central box, pattern speed as a phase.
 */

export interface GalaxyBuild {
  seed: number;
  arms: number;
  pitchAngle: number;
  coreSize: number;
  dustDensity: number;
  bar: number;
  patternSpeed: number;
}

export const STAR_COUNT = 100_000;

function mulberry(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Tanner Helland, "How to Convert Temperature to RGB" (blackbody approximation). */
export function kelvinToRgb(kelvin: number): [number, number, number] {
  const temp = kelvin / 100;
  let r: number;
  let g: number;
  let b: number;
  if (temp <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(temp) - 161.1195681661;
  } else {
    r = 329.698727446 * (temp - 60) ** -0.1332047592;
    g = 288.1221695283 * (temp - 60) ** -0.0755148492;
  }
  if (temp >= 66) b = 255;
  else if (temp <= 19) b = 0;
  else b = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
  const clamp = (value: number) => Math.min(255, Math.max(0, value)) / 255;
  return [clamp(r), clamp(g), clamp(b)];
}

const CLASSES = [30000, 15000, 9000, 6800, 5800, 4500, 3200];

export function armAngle(
  radius: number,
  arm: number,
  arms: number,
  pitch: number,
): number {
  const pitchRad = Math.max(pitch, 0.05);
  return (
    arm * ((Math.PI * 2) / arms) +
    Math.log(Math.max(radius, 0.02)) / Math.tan(pitchRad)
  );
}

export function buildGalaxyBuffers(params: GalaxyBuild, count = STAR_COUNT) {
  const rand = mulberry(params.seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const dustCount = Math.floor(count * 0.25);
  const dustPositions = new Float32Array(dustCount * 3);
  const hiiCount = Math.floor(count * 0.04);
  const hiiPositions = new Float32Array(hiiCount * 3);
  let dustIndex = 0;
  let hiiIndex = 0;
  for (let i = 0; i < count; i += 1) {
    const radius = Math.min(1, -Math.log(1 - rand() * 0.98) * 0.28);
    const arm = Math.floor(rand() * params.arms);
    const onArm = rand() < 0.82;
    const theta = onArm
      ? armAngle(radius, arm, params.arms, params.pitchAngle) +
        params.patternSpeed
      : rand() * Math.PI * 2;
    const jitter = (rand() - 0.5) * (onArm ? 0.02 : 0.04);
    let x = Math.cos(theta) * radius + jitter;
    let z = Math.sin(theta) * radius + jitter;
    if (params.bar > 0.5 && radius < params.coreSize * 1.8) {
      x = (rand() - 0.5) * params.coreSize * 2.4;
      z = (rand() - 0.5) * params.coreSize * 0.45;
    }
    const y = (rand() - 0.5) * 0.03 * (1.1 - radius);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    const young = onArm && radius > params.coreSize;
    const kelvin = young
      ? CLASSES[Math.floor(rand() * 3)]
      : CLASSES[4 + Math.floor(rand() * 3)];
    const rgb = kelvinToRgb(kelvin);
    colors[i * 3] = rgb[0];
    colors[i * 3 + 1] = rgb[1];
    colors[i * 3 + 2] = rgb[2];
    if (young && dustIndex < dustCount && rand() < params.dustDensity) {
      dustPositions[dustIndex * 3] = x * 0.98;
      dustPositions[dustIndex * 3 + 1] = y * 0.2;
      dustPositions[dustIndex * 3 + 2] = z * 0.98;
      dustIndex += 1;
    }
    if (young && hiiIndex < hiiCount && rand() < 0.15) {
      hiiPositions[hiiIndex * 3] = x;
      hiiPositions[hiiIndex * 3 + 1] = y;
      hiiPositions[hiiIndex * 3 + 2] = z;
      hiiIndex += 1;
    }
  }
  return { positions, colors, dustPositions, hiiPositions };
}
