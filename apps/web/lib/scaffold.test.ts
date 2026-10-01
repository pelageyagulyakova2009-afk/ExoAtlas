import { FEATURE_TAGS } from '@exoforge/types';
import { describe, expect, it } from 'vitest';

describe('scaffold', () => {
  it('ships the citizen-science tag set', () => {
    expect(FEATURE_TAGS).toHaveLength(7);
  });
});
