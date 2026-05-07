import { describe, expect, it } from 'vitest';
import { JUNNY_PRODUCT_NAME } from './index';

describe('@junny/core', () => {
  it('exports product name', () => {
    expect(JUNNY_PRODUCT_NAME).toBe('junny');
  });
});
