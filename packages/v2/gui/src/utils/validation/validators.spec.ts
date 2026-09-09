import { describe, expect, it } from 'vitest';
import { dateBefore } from './validators.js';

describe('dateBefore', () => {
  const errorMessage = 'Datoen må være tidligere enn maksimaldatoen.';
  const validate = dateBefore('2026-09-10', errorMessage);

  it('accepts a date before the limit', () => {
    expect(validate('2026-09-09')).toBeUndefined();
  });

  it('rejects a date equal to or after the limit', () => {
    expect(validate('2026-09-10')).toBe(errorMessage);
    expect(validate('2026-09-11')).toBe(errorMessage);
  });
});
