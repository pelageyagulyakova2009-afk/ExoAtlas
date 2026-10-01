export const FEATURE_TAGS = [
  'rings',
  'atmosphere',
  'clouds',
  'spiral',
  'bar',
  'elliptical',
  'dust_lane',
] as const;

export type FeatureTag = (typeof FEATURE_TAGS)[number];

export type ObjectKind = 'planet' | 'galaxy';

export type ObjectStatus = 'unlabeled' | 'queued' | 'labeled';

export interface PlanetParams {
  seed: number;
  seaLevel: number;
  temperature: number;
  moisture: number;
  cloudCoverage: number;
  atmosphereDensity: number;
  axialTilt: number;
  useEarth: number;
}

export interface GalaxyParams {
  seed: number;
  arms: number;
  pitchAngle: number;
  coreSize: number;
  dustDensity: number;
  bar: number;
  patternSpeed: number;
}

export interface ForgeObject {
  id: string;
  seed: number;
  type: ObjectKind;
  params: PlanetParams | GalaxyParams;
  embedding: number[] | null;
  status: ObjectStatus;
  createdAt: string;
}

export interface LabelRecord {
  id: string;
  objectId: string;
  userId: string;
  tags: FeatureTag[];
  confidence: number;
  createdAt: string;
}
