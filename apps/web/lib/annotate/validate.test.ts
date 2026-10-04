import { describe, expect, it } from 'vitest';
import { shouldPostLabel } from './validate';

describe('annotate submit', () => {
  it('does not post when no tag is selected', () => {
    expect(shouldPostLabel([])).toBe(false);
    expect(shouldPostLabel(['clouds'])).toBe(true);
  });
});
