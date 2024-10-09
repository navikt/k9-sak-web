import { Dayjs } from 'dayjs';
import { ISO_DATE_FORMAT } from './formats';
import { initializeDate } from './initializeDate';

export const calcDays = (fraDatoPeriode: Dayjs | string, tilDatoPeriode: Dayjs | string, notWeekends = true) => {
  if (tilDatoPeriode === '9999-12-31') {
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

const checkDays = (weeks?: number, days?: number): string => {
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
