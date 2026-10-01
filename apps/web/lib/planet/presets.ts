import type { PlanetParams } from '@exoforge/types';

export const PLANET_PRESETS: Record<string, Omit<PlanetParams, 'seed'>> = {
  'Earth-like': {
    seaLevel: 0.02,
    temperature: 0.55,
    moisture: 0.62,
    cloudCoverage: 0.55,
    atmosphereDensity: 1,
    axialTilt: 0.41,
    useEarth: 1,
  },
  'Mars-like': {
    seaLevel: 0.9,
    temperature: 0.35,
    moisture: 0.05,
    cloudCoverage: 0.08,
    atmosphereDensity: 0.25,
    axialTilt: 0.44,
    useEarth: 0,
  },
  'Ice World': {
    seaLevel: 0.15,
    temperature: 0.08,
    moisture: 0.4,
    cloudCoverage: 0.35,
    atmosphereDensity: 0.7,
    axialTilt: 0.2,
    useEarth: 0,
  },
  Desert: {
    seaLevel: 0.85,
    temperature: 0.85,
    moisture: 0.08,
    cloudCoverage: 0.05,
    atmosphereDensity: 0.45,
    axialTilt: 0.15,
    useEarth: 0,
  },
  Ocean: {
    seaLevel: 0.2,
    temperature: 0.5,
    moisture: 0.95,
    cloudCoverage: 0.7,
    atmosphereDensity: 1.1,
    axialTilt: 0.3,
    useEarth: 0,
  },
};
