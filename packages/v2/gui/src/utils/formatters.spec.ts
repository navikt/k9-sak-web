import { formatCurrencyWithKr, formatCurrencyWithoutKr } from './formatters';

describe('formatCurrencyWithKr', () => {
  it('should format integers correctly', () => {
    expect(formatCurrencyWithKr(1000)).toBe('1 000 kr');
    expect(formatCurrencyWithKr(0)).toBe('0 kr');
  });

  it('should round decimals to nearest integer', () => {
    expect(formatCurrencyWithKr(1000.4)).toBe('1 000 kr');
    expect(formatCurrencyWithKr(1000.5)).toBe('1 001 kr');
    expect(formatCurrencyWithKr(1000.9)).toBe('1 001 kr');
  });

  it('should handle string inputs', () => {
    expect(formatCurrencyWithKr('1000')).toBe('1 000 kr');
    expect(formatCurrencyWithKr('1000.5')).toBe('1 001 kr');
  });

  it('should format large numbers with spaces between thousands', () => {
    expect(formatCurrencyWithKr(1000000)).toBe('1 000 000 kr');
  });

  it('should return undefined for NaN values', () => {
    expect(formatCurrencyWithKr(NaN)).toBeUndefined();
  });
});

describe('formatCurrencyWithoutKr', () => {
  it('should format integers correctly', () => {
    expect(formatCurrencyWithoutKr(1000)).toBe('1 000');
    expect(formatCurrencyWithoutKr(0)).toBe('0');
  });

  it('should round decimals to nearest integer', () => {
    expect(formatCurrencyWithoutKr(1000.4)).toBe('1 000');
    expect(formatCurrencyWithoutKr(1000.5)).toBe('1 001');
  });

  it('should handle edge cases', () => {
    expect(formatCurrencyWithoutKr(null as unknown as number)).toBeUndefined();
    expect(formatCurrencyWithoutKr(undefined as unknown as number)).toBeUndefined();
  });

  it('should handle pre-formatted values with spaces', () => {
    const valueWithSpaces = '1 234 567';
    expect(formatCurrencyWithoutKr(Number(valueWithSpaces.replace(/\s/g, '')))).toBe('1 234 567');
  });

  it('should return undefined for NaN values', () => {
    expect(formatCurrencyWithoutKr(NaN)).toBeUndefined();
  });
});
