import { describe, expect, it } from 'vitest';
import { attentionPassed, isAttentionCheck } from './attention';
import { cohensKappa } from './impact';
import { addLabel, listLabels, nextUnlabeled, resetMemory } from './memory';
import { shouldTrain } from '@/lib/ml/client';

describe('label API helpers', () => {
  it('queues unlabeled objects then marks them labeled', () => {
    resetMemory();
    const first = nextUnlabeled();
    expect(first?.status).toBe('queued');
    addLabel({
      objectId: first!.id,
      userId: 'user-1',
      tags: ['clouds'],
      confidence: 0.8,
    });
    expect(listLabels()).toHaveLength(1);
    expect(shouldTrain(32)).toBe(true);
    expect(shouldTrain(31)).toBe(false);
  });

  it('flags every 10th label as an attention check', () => {
    expect(isAttentionCheck(10)).toBe(true);
    expect(attentionPassed(['clouds', 'atmosphere', 'rings'])).toBe(true);
    expect(attentionPassed(['rings'])).toBe(false);
  });

  it('returns kappa 1 when two raters match', () => {
    const kappa = cohensKappa([
      {
        id: 'a',
        objectId: 'o',
        userId: 'u1',
        tags: ['spiral'],
        confidence: 1,
        createdAt: '',
      },
      {
        id: 'b',
        objectId: 'o',
        userId: 'u2',
        tags: ['spiral'],
        confidence: 1,
        createdAt: '',
      },
    ]);
    expect(kappa).toBeCloseTo(1, 5);
  });
});
