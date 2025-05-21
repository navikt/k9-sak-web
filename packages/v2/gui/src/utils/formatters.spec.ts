import { formatCurrencyNoKr, formatCurrencyWithKr } from './formatters';

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
});

describe('formatCurrencyNoKr', () => {
  it('should format integers correctly', () => {
    expect(formatCurrencyNoKr(1000)).toBe('1 000');
    expect(formatCurrencyNoKr(0)).toBe('0');
  });

  it('should round decimals to nearest integer', () => {
    expect(formatCurrencyNoKr(1000.4)).toBe('1 000');
    expect(formatCurrencyNoKr(1000.5)).toBe('1 001');
  });

  it('should handle edge cases', () => {
    expect(formatCurrencyNoKr(null as unknown as number)).toBeUndefined();
    expect(formatCurrencyNoKr(undefined as unknown as number)).toBeUndefined();
  });

  it('should handle pre-formatted values with spaces', () => {
    const valueWithSpaces = '1 234 567';
    expect(formatCurrencyNoKr(Number(valueWithSpaces.replace(/\s/g, '')))).toBe('1 234 567');
  });

  it('should return undefined for NaN values', () => {
    expect(formatCurrencyNoKr(NaN)).toBeUndefined();
  });
});
