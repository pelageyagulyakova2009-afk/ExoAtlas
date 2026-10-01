import type { FeatureTag } from '@exoforge/types';

const GROUND_TRUTH: FeatureTag[] = ['clouds', 'atmosphere'];

export function isAttentionCheck(labelCount: number): boolean {
  return labelCount > 0 && labelCount % 10 === 0;
}

export function attentionPassed(tags: FeatureTag[]): boolean {
  return GROUND_TRUTH.every((tag) => tags.includes(tag));
}

export function attentionTruth(): FeatureTag[] {
  return [...GROUND_TRUTH];
}
