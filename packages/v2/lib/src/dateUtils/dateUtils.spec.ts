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
