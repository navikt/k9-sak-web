import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import {
  TIDENES_ENDE,
  addDaysToDate,
  calcDays,
  calcDaysAndWeeks,
  calcDaysAndWeeksWithWeekends,
  checkDays,
  convertHoursToDays,
  findDifferenceInMonthsAndDays,
  formatDate,
  formatereLukketPeriode,
  getRangeOfMonths,
  isValidDate,
  splitWeeksAndDays,
  timeFormat,
  combineConsecutivePeriods,
  checkForOverlap,
  type DateOrPeriod,
} from './dateUtils';

describe('dateUtils', () => {
  it('Skal kalkulere antall dager mellom to datoer inkludert helger og skrive det ut som uker og dager', () => {
    const fom = '2018-04-17';
    const tom = '2018-06-02';
    const message = '6 uker 5 dager';
    expect(calcDaysAndWeeksWithWeekends(fom, tom)).toEqual(message);
  });

  it('Skal kalkulere antall dager mellom to datoer uten helger og skrive det ut som uker og dager', () => {
    const fom = '2018-04-17';
    const tom = '2018-06-02';
    const message = '6 uker 4 dager';
    expect(calcDaysAndWeeks(fom, tom)).toEqual(message);
  });

  it('Skal splitte et sett med uker og dager i to', () => {
    const days = 33;
    const weeks = 2;
    expect(splitWeeksAndDays(weeks, days)).toEqual([
      { weeks: 4, days: 1 },
      { weeks: 4, days: 2 },
    ]);
  });
  it('Skal formatere en dato til ISO', () => {
    const dateTime = '2017-08-02T01:54:25.455';
    expect(formatDate(dateTime)).toEqual('02.08.2017');
  });

  it('Skal formatere et dato til å vise kun klokkeslett', () => {
    const dateTime = '2017-08-02T01:54:25.455';
    expect(timeFormat(dateTime)).toEqual('01:54');
  });

  it('Skal legge til dager på et timestamp og returnere dato', () => {
    const dateTime = '2017-08-02T01:54:25.455';
    const daysToAdd = 6;
    expect(addDaysToDate(dateTime, daysToAdd)).toEqual('2017-08-08');
    expect(addDaysToDate(TIDENES_ENDE, 10)).toBe(TIDENES_ENDE);
  });

  it('skal vise at perioden mellom to datoer er på 5 måneder og 0 dager', () => {
    const fomDate = '2017-12-01';
    const tomDate = '2018-04-30';
    expect(findDifferenceInMonthsAndDays(fomDate, tomDate)).toEqual({
      months: 5,
      days: 0,
    });
  });

  it('skal vise at perioden mellom to datoer er på 11 dager', () => {
    const fomDate = '2018-04-20';
    const tomDate = '2018-04-30';
    expect(findDifferenceInMonthsAndDays(fomDate, tomDate)).toEqual({
      months: 0,
      days: 11,
    });
  });

  it('skal returnere undefined når periode ikke er gyldig fordi fomDato er etter tomDato', () => {
    const fomDate = '2018-04-30';
    const tomDate = '2018-04-10';
    expect(findDifferenceInMonthsAndDays(fomDate, tomDate)).toBeUndefined();
  });

  it('skal kalkulere dager uten å regne med helger', () => {
    const start = dayjs('2023-01-01');
    const end = dayjs('2023-01-10');
    expect(calcDays(start, end)).toBe(7);
  });

  it('skal kalkulere dager inkludert helger', () => {
    const start = dayjs('2023-01-01');
    const end = dayjs('2023-01-10');
    expect(calcDays(start, end, false)).toBe(10);
  });

  it('skal konvertere timer til dager og timer', () => {
    expect(convertHoursToDays(15)).toEqual({ days: 2, hours: 0 });
    expect(convertHoursToDays(16)).toEqual({ days: 2, hours: 1 });
  });

  it('skal formatere dato korrekt', () => {
    expect(formatDate('2023-01-01')).toBe('01.01.2023');
  });

  it('skal dele opp en periode i måneder', () => {
    expect(getRangeOfMonths('2023-01', '2023-03')).toEqual([
      { month: 'January', year: '23' },
      { month: 'February', year: '23' },
      { month: 'March', year: '23' },
    ]);
  });

  it('skal validere en dato', () => {
    expect(isValidDate('2023-01-01')).toBe(true);
    expect(isValidDate('invalid-date')).toBe(false);
  });

  it('skal formatere en lukket periode', () => {
    expect(formatereLukketPeriode('2023-01-01/2023-01-10')).toBe('01.01.2023 - 10.01.2023');
  });

  describe('checkDays', () => {
    it('should return formatted string for weeks and days', () => {
      expect(checkDays(2, 3)).toBe('2 uker 3 dager');
      expect(checkDays(1, 1)).toBe('1 uke 1 dager');
      expect(checkDays(0, 1)).toBe('1 dag');
      expect(checkDays(1, 0)).toBe('1 uke 0 dager');
      expect(checkDays(undefined, undefined)).toBe('Antall uker og dager -');
    });
  });

  describe('calcDays', () => {
    it('should calculate days excluding weekends', () => {
      expect(calcDays('2022-01-01', '2022-01-10')).toBe(6);
    });

    it('should calculate days including weekends', () => {
      expect(calcDays('2022-01-01', '2022-01-10', false)).toBe(10);
    });

    it('should return "Antall uker og dager -" if tilDatoPeriode is TIDENES_ENDE', () => {
      expect(calcDays('2022-01-01', TIDENES_ENDE)).toBe('Antall uker og dager -');
    });
  });

  describe('convertHoursToDays', () => {
    it('should convert hours to days and hours', () => {
      expect(convertHoursToDays(16)).toEqual({ days: 2, hours: 1 });
    });
  });

  describe('calcDaysAndWeeks', () => {
    it('should calculate days and weeks excluding weekends', () => {
      expect(calcDaysAndWeeks('2022-01-01', '2022-01-10')).toBe('1 uke 1 dager');
    });

    it('should return "Antall uker og dager -" if dates are missing', () => {
      expect(calcDaysAndWeeks(undefined, undefined)).toBe('Antall uker og dager -');
    });
  });

  describe('calcDaysAndWeeksWithWeekends', () => {
    it('should calculate days and weeks including weekends', () => {
      expect(calcDaysAndWeeksWithWeekends('2022-01-01', '2022-01-10')).toBe('1 uke 3 dager');
    });
  });

  describe('splitWeeksAndDays', () => {
    it('should split weeks and days correctly', () => {
      expect(splitWeeksAndDays(2, 3)).toEqual([
        { weeks: 1, days: 1 },
        { weeks: 1, days: 2 },
      ]);
    });
  });

  describe('timeFormat', () => {
    it('should format time correctly', () => {
      expect(timeFormat('2022-01-01T12:34:56')).toBe('12:34');
    });
  });

  describe('addDaysToDate', () => {
    it('should add days to date correctly', () => {
      expect(addDaysToDate('2022-01-01', 10)).toBe('2022-01-11');
    });

    it('should return TIDENES_ENDE if dateString is TIDENES_ENDE', () => {
      expect(addDaysToDate(TIDENES_ENDE, 10)).toBe(TIDENES_ENDE);
    });
  });

  describe('findDifferenceInMonthsAndDays', () => {
    it('should find difference in months and days correctly', () => {
      expect(findDifferenceInMonthsAndDays('2022-01-01', '2022-03-15')).toEqual({ months: 2, days: 15 });
    });

    it('should return undefined if dates are invalid', () => {
      expect(findDifferenceInMonthsAndDays('invalid-date', '2022-03-15')).toBeUndefined();
    });
  });

  describe('getRangeOfMonths', () => {
    it('should get range of months correctly', () => {
      expect(getRangeOfMonths('2022-01', '2022-03')).toEqual([
        { month: 'January', year: '22' },
        { month: 'February', year: '22' },
        { month: 'March', year: '22' },
      ]);
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date', () => {
      expect(isValidDate('2022-01-01')).toBe(true);
    });

    it('should return false for invalid date', () => {
      expect(isValidDate('invalid-date')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      expect(formatDate('2022-01-01')).toBe('01.01.2022');
    });
  });

  describe('formatereLukketPeriode', () => {
    it('should format closed period correctly', () => {
      expect(formatereLukketPeriode('2022-01-01/2022-01-10')).toBe('01.01.2022 - 10.01.2022');
    });

    it('should return input if period is invalid', () => {
      expect(formatereLukketPeriode('invalid-period')).toBe('invalid-period');
    });
  });
});

describe('combineConsecutivePeriods', () => {
  it('should return empty array for empty input', () => {
    expect(combineConsecutivePeriods([])).toEqual([]);
  });

  it('should handle single dates', () => {
    const dates: DateOrPeriod[] = ['2023-01-01', '2023-01-03', '2023-01-02'];
    const result = combineConsecutivePeriods(dates);
    expect(result).toEqual([{ fom: '2023-01-01', tom: '2023-01-03' }]);
  });

  it('should handle periods', () => {
    const periods: DateOrPeriod[] = [
      { fom: '2023-01-01', tom: '2023-01-05' },
      { fom: '2023-01-03', tom: '2023-01-07' },
      { fom: '2023-01-10', tom: '2023-01-12' },
    ];
    const result = combineConsecutivePeriods(periods);
    expect(result).toEqual([
      { fom: '2023-01-01', tom: '2023-01-07' },
      { fom: '2023-01-10', tom: '2023-01-12' },
    ]);
  });

  it('should handle mixed dates and periods', () => {
    const mixed: DateOrPeriod[] = [
      '2023-01-01',
      { fom: '2023-01-02', tom: '2023-01-04' },
      '2023-01-05',
      { fom: '2023-01-08', tom: '2023-01-10' },
    ];
    const result = combineConsecutivePeriods(mixed);
    expect(result).toEqual([
      { fom: '2023-01-01', tom: '2023-01-05' },
      { fom: '2023-01-08', tom: '2023-01-10' },
    ]);
  });

  it('should handle consecutive periods', () => {
    const periods: DateOrPeriod[] = [
      { fom: '2023-01-01', tom: '2023-01-05' },
      { fom: '2023-01-06', tom: '2023-01-10' },
    ];
    const result = combineConsecutivePeriods(periods);
    expect(result).toEqual([{ fom: '2023-01-01', tom: '2023-01-10' }]);
  });

  it('should handle overlapping periods', () => {
    const periods: DateOrPeriod[] = [
      { fom: '2023-01-01', tom: '2023-01-05' },
      { fom: '2023-01-03', tom: '2023-01-07' },
      { fom: '2023-01-06', tom: '2023-01-10' },
    ];
    const result = combineConsecutivePeriods(periods);
    expect(result).toEqual([{ fom: '2023-01-01', tom: '2023-01-10' }]);
  });

  it('should handle non-overlapping periods', () => {
    const periods: DateOrPeriod[] = [
      { fom: '2023-01-01', tom: '2023-01-05' },
      { fom: '2023-01-10', tom: '2023-01-15' },
      { fom: '2023-01-20', tom: '2023-01-25' },
    ];
    const result = combineConsecutivePeriods(periods);
    expect(result).toEqual([
      { fom: '2023-01-01', tom: '2023-01-05' },
      { fom: '2023-01-10', tom: '2023-01-15' },
      { fom: '2023-01-20', tom: '2023-01-25' },
    ]);
  });

  it('should handle single date', () => {
    const dates: DateOrPeriod[] = ['2023-01-01'];
    const result = combineConsecutivePeriods(dates);
    expect(result).toEqual([{ fom: '2023-01-01', tom: '2023-01-01' }]);
  });

  it('should handle single period', () => {
    const periods: DateOrPeriod[] = [{ fom: '2023-01-01', tom: '2023-01-05' }];
    const result = combineConsecutivePeriods(periods);
    expect(result).toEqual([{ fom: '2023-01-01', tom: '2023-01-05' }]);
  });
});

describe('checkForOverlap', () => {
  const testPeriods = [
    { fom: '2023-01-01', tom: '2023-01-05' },
    { fom: '2023-01-10', tom: '2023-01-15' },
    { fom: '2023-01-20', tom: '2023-01-25' },
  ];

  it('should return false when no overlap exists', () => {
    const currentPeriod = { fom: '2023-01-06', tom: '2023-01-09' };
    const result = checkForOverlap(0, currentPeriod, testPeriods);
    expect(result).toBe(false);
  });

  it('should return true when periods overlap - current starts before other and ends within other', () => {
    const currentPeriod = { fom: '2023-01-08', tom: '2023-01-12' };
    const result = checkForOverlap(0, currentPeriod, testPeriods);
    expect(result).toBe(true);
  });

  it('should return true when periods overlap - current starts within other and ends after other', () => {
    const currentPeriod = { fom: '2023-01-12', tom: '2023-01-18' };
    const result = checkForOverlap(0, currentPeriod, testPeriods);
    expect(result).toBe(true);
  });

  it('should return true when periods overlap - current is completely within other', () => {
    const currentPeriod = { fom: '2023-01-11', tom: '2023-01-14' };
    const result = checkForOverlap(0, currentPeriod, testPeriods);
    expect(result).toBe(true);
  });

  it('should return true when periods overlap - current completely contains other', () => {
    const currentPeriod = { fom: '2023-01-09', tom: '2023-01-16' };
    const result = checkForOverlap(0, currentPeriod, testPeriods);
    expect(result).toBe(true);
  });

  it('should return true when periods are identical', () => {
    const currentPeriod = { fom: '2023-01-10', tom: '2023-01-15' };
    const result = checkForOverlap(0, currentPeriod, testPeriods);
    expect(result).toBe(true);
  });

  it('should return true when periods share the same start date', () => {
    const currentPeriod = { fom: '2023-01-10', tom: '2023-01-12' };
    const result = checkForOverlap(0, currentPeriod, testPeriods);
    expect(result).toBe(true);
  });

  it('should return true when periods share the same end date', () => {
    const currentPeriod = { fom: '2023-01-12', tom: '2023-01-15' };
    const result = checkForOverlap(0, currentPeriod, testPeriods);
    expect(result).toBe(true);
  });

  it('should return false when periods are edge-to-edge (adjacent but not overlapping)', () => {
    const currentPeriod = { fom: '2023-01-06', tom: '2023-01-09' };
    const result = checkForOverlap(0, currentPeriod, testPeriods);
    expect(result).toBe(false);
  });

  it('should return false when comparing period with itself (same index)', () => {
    const currentPeriod = { fom: '2023-01-01', tom: '2023-01-05' };
    const result = checkForOverlap(0, currentPeriod, testPeriods);
    expect(result).toBe(false);
  });

  it('should return false when current period has empty fom', () => {
    const currentPeriod = { fom: '', tom: '2023-01-12' };
    const result = checkForOverlap(0, currentPeriod, testPeriods);
    expect(result).toBe(false);
  });

  it('should return false when current period has empty tom', () => {
    const currentPeriod = { fom: '2023-01-11', tom: '' };
    const result = checkForOverlap(0, currentPeriod, testPeriods);
    expect(result).toBe(false);
  });

  it('should ignore periods with empty dates in the array', () => {
    const periodsWithEmptyDates = [
      { fom: '2023-01-01', tom: '2023-01-05' },
      { fom: '', tom: '2023-01-10' },
      { fom: '2023-01-15', tom: '' },
      { fom: '2023-01-20', tom: '2023-01-25' },
    ];
    const currentPeriod = { fom: '2023-01-06', tom: '2023-01-19' };
    const result = checkForOverlap(0, currentPeriod, periodsWithEmptyDates);
    expect(result).toBe(false);
  });

  it('should detect overlap with multiple periods', () => {
    const currentPeriod = { fom: '2023-01-03', tom: '2023-01-22' };
    const result = checkForOverlap(3, currentPeriod, testPeriods); // Using index 3 to avoid self-comparison
    expect(result).toBe(true);
  });

  it('should handle single-day periods', () => {
    const singleDayPeriods = [
      { fom: '2023-01-01', tom: '2023-01-01' },
      { fom: '2023-01-03', tom: '2023-01-03' },
      { fom: '2023-01-05', tom: '2023-01-05' },
    ];
    const currentPeriod = { fom: '2023-01-01', tom: '2023-01-01' };
    const result = checkForOverlap(1, currentPeriod, singleDayPeriods);
    expect(result).toBe(true);
  });

  it('should return false for adjacent single-day periods', () => {
    const singleDayPeriods = [
      { fom: '2023-01-01', tom: '2023-01-01' },
      { fom: '2023-01-03', tom: '2023-01-03' },
    ];
    const currentPeriod = { fom: '2023-01-02', tom: '2023-01-02' };
    const result = checkForOverlap(1, currentPeriod, singleDayPeriods);
    expect(result).toBe(false);
  });
});
