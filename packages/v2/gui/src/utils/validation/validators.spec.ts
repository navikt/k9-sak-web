import { describe, expect, it } from 'vitest';
import { dateBefore, dateIsNotWeekend } from './validators.js';

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

describe('dateIsNotWeekend', () => {
  it('accepts weekdays', () => {
    expect(dateIsNotWeekend('2026-09-10')).toBeUndefined();
  });

  it('rejects Saturdays and Sundays', () => {
    expect(dateIsNotWeekend('2026-09-12')).toBe('Dato kan ikke være en helgedag');
    expect(dateIsNotWeekend('2026-09-13')).toBe('Dato kan ikke være en helgedag');
  });

  it('leaves empty and invalid dates to other validators', () => {
    expect(dateIsNotWeekend('')).toBeUndefined();
    expect(dateIsNotWeekend('not-a-date')).toBeUndefined();
  });
});
