import { describe, expect, it } from 'vitest';
import { getFirstAndLastWeek, prettifyPeriod, sortPeriodsByNewest, sortPeriodsChronological } from './periodUtils.js';

const periode = (fom: string, tom: string) => ({ fom, tom });

describe('periodUtils', () => {
  it('sorterer perioder kronologisk', () => {
    expect(sortPeriodsChronological(periode('2024-01-01', '2024-01-10'), periode('2024-02-01', '2024-02-10'))).toBe(-1);
  });

  it('sorterer perioder med nyeste først', () => {
    expect(sortPeriodsByNewest(periode('2024-01-01', '2024-01-10'), periode('2024-02-01', '2024-02-10'))).toBe(1);
  });

  it('formaterer perioder med datoer', () => {
    expect(prettifyPeriod('2024-01-02', '2024-01-05')).toBe('02.01.2024 - 05.01.2024');
  });

  it('returnerer ukeintervall også når perioden krysser årsskifte', () => {
    expect(getFirstAndLastWeek('2024-12-29', '2025-01-03')).toBe('52 - 1');
  });

  it('bruker ISO-uke for perioder på starten av et nytt år', () => {
    expect(getFirstAndLastWeek('2027-01-01', '2027-01-03')).toBe('53');
    expect(getFirstAndLastWeek('2026-12-28', '2026-12-31')).toBe('53');
  });
});
