import type {
  FeatureTag,
  ForgeObject,
  GalaxyParams,
  LabelRecord,
  PlanetParams,
} from '@exoforge/types';
import { seedToGalaxy } from '@/lib/galaxy/params';
import { seedToParams } from '@/lib/planet/params';

export interface ModelRow {
  id: string;
  version: number;
  weightsPath: string | null;
  metrics: Record<string, number>;
  trainedAt: string;
}

type Memory = {
  objects: ForgeObject[];
  labels: LabelRecord[];
  models: ModelRow[];
};

const memory: Memory = ((
  globalThis as typeof globalThis & { __exoforge?: Memory }
).__exoforge ??= {
  objects: [],
  labels: [],
  models: [],
});

const { objects, labels, models } = memory;

function id() {
  return crypto.randomUUID();
}

export function resetMemory() {
  objects.length = 0;
  labels.length = 0;
  models.length = 0;
  for (let seed = 1; seed <= 24; seed += 1) {
    const type = seed % 2 === 0 ? 'galaxy' : 'planet';
    const params = type === 'planet' ? seedToParams(seed) : seedToGalaxy(seed);
    objects.push({
      id: `obj-${seed}`,
      seed,
      type,
      params,
      embedding: null,
      status: 'unlabeled',
      createdAt: new Date(0).toISOString(),
    });
  }
}

if (objects.length === 0) resetMemory();

export function listObjects() {
  return objects;
}

export function listLabels() {
  return labels;
}

export function listModels() {
  return models;
}

export function nextUnlabeled(): ForgeObject | null {
  const row = objects.find((object) => object.status === 'unlabeled');
  if (!row) return null;
  row.status = 'queued';
  return row;
}

export function addLabel(input: {
  objectId: string;
  userId: string;
  tags: FeatureTag[];
  confidence: number;
}): LabelRecord {
  const object = objects.find((row) => row.id === input.objectId);
  if (!object) throw new Error('missing object');
  const label: LabelRecord = {
    id: id(),
    objectId: input.objectId,
    userId: input.userId,
    tags: input.tags,
    confidence: input.confidence,
    createdAt: new Date().toISOString(),
  };
  labels.push(label);
  object.status = 'labeled';
  return label;
}

export function recordModel(metrics: Record<string, number>): ModelRow {
  const row: ModelRow = {
    id: id(),
    version: models.length + 1,
    weightsPath: `models/probe-v${models.length + 1}.json`,
    metrics,
    trainedAt: new Date().toISOString(),
  };
  models.push(row);
  return row;
}

export function tagHistogram(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const label of labels) {
    for (const tag of label.tags) counts[tag] = (counts[tag] ?? 0) + 1;
  }
  return counts;
}

export type AnyParams = PlanetParams | GalaxyParams;
