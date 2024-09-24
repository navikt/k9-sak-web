import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import {
  TIDENES_ENDE,
  addDaysToDate,
  calcDays,
  calcDaysAndWeeks,
  calcDaysAndWeeksWithWeekends,
  convertHoursToDays,
  dateFormat,
  findDifferenceInMonthsAndDays,
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
    expect(dateFormat(dateTime)).toEqual('02.08.2017');
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
    expect(dateFormat('2023-01-01')).toBe('01.01.2023');
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
});
