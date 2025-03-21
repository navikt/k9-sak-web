import { describe, expect, it } from 'vitest';
import { formatDateStringToDDMMYYYY } from './dateutils';

describe('formatDateToDDMMYYYY', () => {
  it('should format date string to DD.MM.YYYY format', () => {
    expect(formatDateStringToDDMMYYYY('2023-10-15')).toBe('15.10.2023');
  });

  it('should return empty string when input is empty', () => {
    expect(formatDateStringToDDMMYYYY('')).toBe('');
  });

  it('should handle date with single digit day and month', () => {
    expect(formatDateStringToDDMMYYYY('2023-01-05')).toBe('05.01.2023');
  });

  it('should handle date object string format', () => {
    expect(formatDateStringToDDMMYYYY(new Date('2023-12-31').toISOString())).toBe('31.12.2023');
  });
});
