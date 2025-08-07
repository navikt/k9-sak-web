import { Dayjs } from 'dayjs';
import { DDMMYYYY_DATE_FORMAT, HHMM_TIME_FORMAT, ISO_DATE_FORMAT, YYYY_MM_FORMAT } from './formats';
import { initializeDate } from './initializeDate';

export const TIDENES_ENDE = '9999-12-31';
export const TIMER_PER_DAG = 7.5;

// Type for periods that can be combined
export type Period = { fom: string; tom: string };

// Type for single dates or periods
export type DateOrPeriod = string | Period;

// Helper function to check if a date is within a period
const isDateInPeriod = (date: string, period: Period): boolean => {
  const dateObj = initializeDate(date);
  const fomObj = initializeDate(period.fom);
  const tomObj = initializeDate(period.tom);
  return dateObj.isSameOrAfter(fomObj) && dateObj.isSameOrBefore(tomObj);
};

// Helper function to check if two periods are consecutive (edge to edge)
const arePeriodsConsecutive = (period1: Period, period2: Period): boolean => {
  const period1Tom = initializeDate(period1.tom);
  const period2Fom = initializeDate(period2.fom);
  return period1Tom.add(1, 'day').isSame(period2Fom);
};

// Helper function to check if two periods can be combined
const canCombinePeriods = (period1: Period, period2: Period): boolean => {
  // Check if periods overlap
  const hasOverlap = isDateInPeriod(period2.fom, period1) || isDateInPeriod(period1.tom, period2);
  // Check if periods are consecutive
  const areConsecutive = arePeriodsConsecutive(period1, period2);
  return hasOverlap || areConsecutive;
};

// Helper function to combine two periods
const combineTwoPeriods = (period1: Period, period2: Period): Period => {
  const fom1 = initializeDate(period1.fom);
  const tom1 = initializeDate(period1.tom);
  const fom2 = initializeDate(period2.fom);
  const tom2 = initializeDate(period2.tom);
  
  const newFom = fom1.isBefore(fom2) ? period1.fom : period2.fom;
  const newTom = tom1.isAfter(tom2) ? period1.tom : period2.tom;
  
  return { fom: newFom, tom: newTom };
};

// Helper function to convert single dates to periods
const convertDateToPeriod = (dateOrPeriod: DateOrPeriod): Period => {
  if (typeof dateOrPeriod === 'string') {
    return { fom: dateOrPeriod, tom: dateOrPeriod };
  }
  return dateOrPeriod;
};

// Helper function to sort periods by start date
const sortPeriodsByFom = (periods: Period[]): Period[] => {
  return periods.sort((a, b) => {
    const aFom = initializeDate(a.fom);
    const bFom = initializeDate(b.fom);
    return aFom.isBefore(bFom) ? -1 : aFom.isAfter(bFom) ? 1 : 0;
  });
};

/**
 * Combines consecutive and overlapping periods into a minimal set of non-overlapping periods.
 * Can handle both single dates (as strings) and periods (as objects with fom and tom).
 * 
 * @param datesOrPeriods - Array of dates (strings) or periods (objects with fom and tom)
 * @returns Array of combined periods
 */
export const combineConsecutivePeriods = (datesOrPeriods: DateOrPeriod[]): Period[] => {
  if (!datesOrPeriods || datesOrPeriods.length === 0) {
    return [];
  }

  // Convert all inputs to periods
  const periods: Period[] = datesOrPeriods.map(convertDateToPeriod);
  
  // Sort periods by start date
  const sortedPeriods = sortPeriodsByFom(periods);
  const combinedPeriods: Period[] = [];

  for (const currentPeriod of sortedPeriods) {
    const lastCombinedPeriod = combinedPeriods[combinedPeriods.length - 1];
    
    if (!lastCombinedPeriod) {
      combinedPeriods.push(currentPeriod);
      continue;
    }

    if (canCombinePeriods(lastCombinedPeriod, currentPeriod)) {
      // Combine with the last period
      const combinedPeriod = combineTwoPeriods(lastCombinedPeriod, currentPeriod);
      combinedPeriods[combinedPeriods.length - 1] = combinedPeriod;
    } else {
      // Add as a new period
      combinedPeriods.push(currentPeriod);
    }
  }

  return combinedPeriods;
};

export const calcDays = (fraDatoPeriode: Dayjs | string, tilDatoPeriode: Dayjs | string, notWeekends = true) => {
  if (tilDatoPeriode === TIDENES_ENDE) {
    return checkDays(undefined, undefined);
  }

  const fraDato = typeof fraDatoPeriode === 'string' ? initializeDate(fraDatoPeriode, ISO_DATE_FORMAT) : fraDatoPeriode;
  const tilDato = typeof tilDatoPeriode === 'string' ? initializeDate(tilDatoPeriode, ISO_DATE_FORMAT) : tilDatoPeriode;
  let numOfDays: number;

  if (notWeekends) {
    let count = tilDato.diff(fraDato, 'days');
    let nyFraDato = fraDato.clone();
    numOfDays = fraDato.isoWeekday() !== 6 && fraDato.isoWeekday() !== 7 ? 1 : 0;

    while (count > 0) {
      nyFraDato = nyFraDato.add(1, 'days');

      if (nyFraDato.isoWeekday() !== 6 && nyFraDato.isoWeekday() !== 7) {
        numOfDays += 1;
      }

      count -= 1;
    }
  } else {
    // Vi legger til én dag for å få med startdato i perioden
    numOfDays = tilDato.diff(fraDato, 'days') + 1;
  }

  return numOfDays;
};

export const checkDays = (weeks?: number, days?: number): string => {
  let tekst = `${weeks} uker ${days} dager`;

  if (weeks === undefined && days === undefined) {
    tekst = 'Antall uker og dager -';
  }

  if (days === 0) {
    tekst = weeks === 1 ? `${weeks} uke` : `${weeks} uker`;
  }

  if (weeks === 0) {
    tekst = days === 1 ? `${days} dag` : `${days} dager`;
  }

  if (days === 1) {
    tekst = weeks === 1 ? `${weeks} uke ${days} dag` : `${weeks} uker ${days} dag`;

    if (weeks === 0) {
      tekst = `${days} dag`;
    }
  }

  if (weeks === 1) {
    tekst = `${weeks} uke ${days} dager`;
  }

  return tekst;
};

export const calcDaysAndWeeksWithWeekends = (fraDatoPeriode: Dayjs | string, tilDatoPeriode: Dayjs | string) => {
  const notWeekends = false;

  const numOfDays = calcDays(fraDatoPeriode, tilDatoPeriode, notWeekends);

  if (typeof numOfDays === 'string') {
    return numOfDays;
  }

  const weeks = Math.floor(numOfDays / 7);
  const days = numOfDays % 7;

  return checkDays(weeks, days);
};

export const calcDaysAndWeeks = (fraDatoPeriode?: string, tilDatoPeriode?: string) => {
  if (!fraDatoPeriode || !tilDatoPeriode) {
    return 'Antall uker og dager -';
  }
  const numOfDays = calcDays(fraDatoPeriode, tilDatoPeriode);

  if (typeof numOfDays === 'string') {
    return numOfDays;
  }

  const weeks = Math.floor(numOfDays / 5);
  const days = numOfDays % 5;
  return checkDays(weeks, days);
};

export const formatPeriod = (fomDate: string, tomDate: string): string =>
  `${formatDate(fomDate)} - ${formatDate(tomDate)}`;

export default function dateSorter(date1: Dayjs, date2: Dayjs) {
  if (date1.isBefore(date2)) {
    return -1;
  }
  if (date2.isBefore(date1)) {
    return 1;
  }
  return 0;
}

export function dateStringSorter(date1: string, date2: string) {
  const date1AsDayjs = initializeDate(date1);
  const date2AsDayjs = initializeDate(date2);
  return dateSorter(date1AsDayjs, date2AsDayjs);
}
export const convertHoursToDays = (hoursToConvert: number) => {
  const days = Math.floor(hoursToConvert / TIMER_PER_DAG);
  const hours = hoursToConvert % TIMER_PER_DAG;
  return { days, hours };
};

export const splitWeeksAndDays = (weeks: number, days: number) => {
  const allDays = weeks ? weeks * 5 + days : days;
  const firstPeriodDays = allDays % 2 === 0 ? allDays / 2 : allDays / 2 + 0.5;
  const secondPeriodDays = allDays % 2 === 0 ? allDays / 2 : allDays / 2 - 0.5;
  const firstPeriodWeeksAndDays = { weeks: Math.trunc(firstPeriodDays / 5), days: firstPeriodDays % 5 };
  const secondPeriodWeeksAndDays = { weeks: Math.trunc(secondPeriodDays / 5), days: secondPeriodDays % 5 };
  return [secondPeriodWeeksAndDays, firstPeriodWeeksAndDays];
};

export const formatDate = (date: string) => initializeDate(date).format(DDMMYYYY_DATE_FORMAT);

export const timeFormat = (date: string) => initializeDate(date, '', false, true).format(HHMM_TIME_FORMAT);

// Skal ikke legge til dag når dato er tidenes ende
export const addDaysToDate = (dateString: string, nrOfDays: number) =>
  dateString === TIDENES_ENDE
    ? dateString
    : initializeDate(dateString, ISO_DATE_FORMAT).add(nrOfDays, 'days').format(ISO_DATE_FORMAT);

export const findDifferenceInMonthsAndDays = (fomDate: string, tomDate: string) => {
  const fDate = initializeDate(fomDate, ISO_DATE_FORMAT, true);
  const tDate = initializeDate(tomDate, ISO_DATE_FORMAT, true).add(1, 'days');
  if (!fDate.isValid() || !tDate.isValid() || fDate.isAfter(tDate)) {
    return undefined;
  }

  const months = tDate.diff(fDate, 'months');
  const updatedFDate = fDate.add(months, 'months');

  return {
    months,
    days: tDate.diff(updatedFDate, 'days'),
  };
};

export const getRangeOfMonths = (fom: string, tom: string) => {
  const fraMåned = initializeDate(fom, YYYY_MM_FORMAT);
  const tilMåned = initializeDate(tom, YYYY_MM_FORMAT);
  let currentMonth = fraMåned;
  const range = [
    {
      month: currentMonth.format('MMMM'),
      year: currentMonth.format('YY'),
    },
  ];

  while (currentMonth.isBefore(tilMåned)) {
    currentMonth = currentMonth.add(1, 'month');
    range.push({
      month: currentMonth.format('MMMM'),
      year: currentMonth.format('YY'),
    });
  }

  return range;
};

export const isValidDate = (date: string) => initializeDate(date, ISO_DATE_FORMAT, true).isValid();

// Eksempel på lukket periode fra Årskvantum: 2022-02-07/2022-02-08
export const formatereLukketPeriode = (periode: string): string => {
  const [fom, tom] = periode.split('/');
  if (!fom || !tom) {
    return periode;
  }
  return `${formatDate(fom)} - ${formatDate(tom)}`;
};

