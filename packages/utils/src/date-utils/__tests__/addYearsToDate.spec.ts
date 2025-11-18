import addYearsToDate from '../addYearsToDate';

describe('addYearsToDate', () => {
  it('adds years correctly for a standard date', () => {
    expect(addYearsToDate('2020-01-01', 1)).toBe('01.01.2021');
    expect(addYearsToDate('2025-06-02', 5)).toBe('02.06.2030');
  });

  it('handles leap day correctly when resulting year is not leap', () => {
    // 2020-02-29 + 1 year -> 2021-02-28
    expect(addYearsToDate('2020-02-29', 1)).toBe('28.02.2021');
  });

  it('handles leap day correctly when resulting year is also leap', () => {
    // 2000-02-29 + 4 years -> 2004-02-29
    expect(addYearsToDate('2000-02-29', 4)).toBe('29.02.2004');
  });

  it('supports subtracting years when given negative value', () => {
    expect(addYearsToDate('2025-06-02', -1)).toBe('02.06.2024');
  });

  it('returns "Invalid Date" for invalid input', () => {
    // If date string cannot be parsed, prettifyDate returns 'Invalid Date'
    expect(addYearsToDate('', 1)).toBe('Invalid Date');
    expect(addYearsToDate('not-a-date', 1)).toBe('Invalid Date');
  });
});
