import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { formatDate, utledInnsendtSoknadsfrist } from './utils';

describe('formatDate', () => {
  it('should format a valid date string correctly', () => {
    const result = formatDate('2023-01-01');
    expect(result).toBe('01.01.2023');
  });

  it('should handle an invalid date string', () => {
    const result = formatDate('invalid-date');
    expect(result).toBe('Invalid Date');
  });

  it('should handle an empty date string', () => {
    const result = formatDate('');
    expect(result).toBe('Invalid Date');
  });
});

describe('utledInnsendtSoknadsfrist', () => {
  it('should return formatted date string for a valid date input', () => {
    const result = utledInnsendtSoknadsfrist('2023-01-01');
    expect(result).toBe('2022-10-01');
  });

  it('should return date object for a valid date input without formatting', () => {
    const result = utledInnsendtSoknadsfrist('2023-01-01', false);
    expect(result).toStrictEqual(initializeDate('2022-10-01'));
  });

  it('should handle an invalid date string', () => {
    const result = utledInnsendtSoknadsfrist('invalid-date');
    expect(result).toBe('Invalid Date');
  });
});
