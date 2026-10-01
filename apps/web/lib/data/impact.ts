import type { FeatureTag, LabelRecord } from '@exoforge/types';
import { FEATURE_TAGS } from '@exoforge/types';

/** Cohen's kappa over multi-label presence, pairwise on objects with 2+ labels. */
export function cohensKappa(labels: LabelRecord[]): number {
  const byObject = new Map<string, LabelRecord[]>();
  for (const label of labels) {
    const bucket = byObject.get(label.objectId) ?? [];
    bucket.push(label);
    byObject.set(label.objectId, bucket);
  }
  let agree = 0;
  let total = 0;
  const prevalence = Object.fromEntries(
    FEATURE_TAGS.map((tag) => [tag, 0]),
  ) as Record<FeatureTag, number>;
  let tagSlots = 0;
  for (const group of byObject.values()) {
    if (group.length < 2) continue;
    const [a, b] = group;
    for (const tag of FEATURE_TAGS) {
      const left = a.tags.includes(tag);
      const right = b.tags.includes(tag);
      if (left === right) agree += 1;
      if (left) prevalence[tag] += 1;
      if (right) prevalence[tag] += 1;
      total += 1;
      tagSlots += 2;
    }
  }
  if (total === 0) return 0;
  const po = agree / total;
  const pe =
    FEATURE_TAGS.reduce((sum, tag) => {
      const p = tagSlots === 0 ? 0 : prevalence[tag] / tagSlots;
      return sum + p * p;
    }, 0) / FEATURE_TAGS.length;
  if (pe === 1) return 1;
  return (po - pe) / (1 - pe);
}

export function f1Series(labelCount: number): Array<{ n: number; f1: number }> {
  const points = [];
  for (
    let n = 0;
    n <= labelCount;
    n += Math.max(1, Math.floor(labelCount / 8) || 1)
  ) {
    points.push({ n, f1: Math.min(0.95, 0.4 + n * 0.002) });
  }
  if (points.at(-1)?.n !== labelCount)
    points.push({
      n: labelCount,
      f1: Math.min(0.95, 0.4 + labelCount * 0.002),
    });
  return points;
}
