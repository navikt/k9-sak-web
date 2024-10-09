import { Dayjs } from 'dayjs';
import 'moment/locale/nb';
import initializeDate from './date-utils/initialize';
import { DDMMYYYY_DATE_FORMAT, HHMM_TIME_FORMAT, ISO_DATE_FORMAT, YYYY_MM_FORMAT } from './formats';

export const TIDENES_ENDE = '9999-12-31';
export const TIMER_PER_DAG = 7.5;

// TODO Denne funksjonen må ut ifrå utils. Dette er uttakslogikk
const checkDays = (weeks: number, days: number): string => {
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

export const convertHoursToDays = (hoursToConvert: number) => {
  const days = Math.floor(hoursToConvert / TIMER_PER_DAG);
  const hours = hoursToConvert % TIMER_PER_DAG;
  return { days, hours };
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

export const splitWeeksAndDays = (weeks: number, days: number) => {
  const returnArray = [];
  const allDays = weeks ? weeks * 5 + days : days;
  const firstPeriodDays = allDays % 2 === 0 ? allDays / 2 : allDays / 2 + 0.5;
  const secondPeriodDays = allDays % 2 === 0 ? allDays / 2 : allDays / 2 - 0.5;
  const firstPeriodWeeksAndDays = { weeks: Math.trunc(firstPeriodDays / 5), days: firstPeriodDays % 5 };
  const secondPeriodWeeksAndDays = { weeks: Math.trunc(secondPeriodDays / 5), days: secondPeriodDays % 5 };
  returnArray.push(secondPeriodWeeksAndDays, firstPeriodWeeksAndDays);
  return returnArray;
};

export const dateFormat = (date: string) => initializeDate(date).format(DDMMYYYY_DATE_FORMAT);

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

export const formatDate = (date: string): string => initializeDate(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT);

// Eksempel på lukket periode fra Årskvantum: 2022-02-07/2022-02-08
export const formatereLukketPeriode = (periode: string): string => {
  const [fom, tom] = periode.split('/');
  return `${formatDate(fom)} - ${formatDate(tom)}`;
};
