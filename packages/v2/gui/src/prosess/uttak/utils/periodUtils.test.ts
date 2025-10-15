import { describe, it, expect } from 'vitest';
import { sortPeriodsChronological, sortPeriodsByNewest, prettifyPeriod, getFirstAndLastWeek } from './periodUtils';

interface Periode {
  fom: string;
  tom: string;
}

const p = (fom: string, tom: string): Periode => ({ fom, tom });

describe('periodUtils - sortering', () => {
  it('sortPeriodsChronological returnerer -1 når første periode starter tidligere', () => {
    await expect(sortPeriodsChronological(p('2024-01-01', '2024-01-10'), p('2024-02-01', '2024-02-10'))).toBe(-1);
  });
  it('sortPeriodsChronological returnerer 1 når første periode starter senere', () => {
    await expect(sortPeriodsChronological(p('2024-03-01', '2024-03-10'), p('2024-02-01', '2024-02-10'))).toBe(1);
  });
  it('sortPeriodsChronological returnerer 0 når samme start', () => {
    await expect(sortPeriodsChronological(p('2024-02-01', '2024-02-10'), p('2024-02-01', '2024-02-15'))).toBe(0);
  });
  it('sortPeriodsByNewest inverserer rekkefølge', () => {
    const a = p('2024-01-01', '2024-01-10');
    const b = p('2024-02-01', '2024-02-10');
    await expect(sortPeriodsByNewest(a, b)).toBe(1);
    await expect(sortPeriodsByNewest(b, a)).toBe(-1);
  });
});

describe('periodUtils - formatering', () => {
  it('prettifyPeriod formaterer som dd.MM.yyyy - dd.MM.yyyy', () => {
    const formatted = prettifyPeriod('2024-01-02', '2024-01-05');
    await expect(formatted).toMatch('02.01.2024 - 05.01.2024');
  });
  it('getFirstAndLastWeek returnerer ukeintervall', () => {
    const interval = getFirstAndLastWeek('2024-03-02', '2024-04-15');
    await expect(interval).toMatch('9 - 16');
  });
  it('getFirstAndLastWeek håndterer årsskifte', () => {
    const interval = getFirstAndLastWeek('2024-12-29', '2025-01-03');
    await expect(interval).toMatch('52 - 1');
  });
});
