import type { FomTom } from './dateUtils.js';
import { DDMMYYYY_DATE_FORMAT } from './formats.js';
import { initializeDate } from './initializeDate.js';

export const sortPeriodsChronological = (period1: FomTom, period2: FomTom): number => {
  const p1start = initializeDate(period1.fom);
  const p2start = initializeDate(period2.fom);
  if (p1start.isBefore(p2start)) {
    return -1;
  }
  if (p2start.isBefore(p1start)) {
    return 1;
  }

  return 0;
};

export const sortPeriodsByNewest = (period1: FomTom, period2: FomTom): number => {
  const p1start = initializeDate(period1.fom);
  const p2start = initializeDate(period2.fom);
  if (p1start.isBefore(p2start)) {
    return 1;
  }
  if (p2start.isBefore(p1start)) {
    return -1;
  }
  return 0;
};

export function prettifyPeriod(fom: string, tom: string): string {
  return `${initializeDate(fom).format(DDMMYYYY_DATE_FORMAT)} - ${initializeDate(tom).format(DDMMYYYY_DATE_FORMAT)}`;
}

export function getFirstAndLastWeek(fom: string, tom: string): string {
  const fomWeek = initializeDate(fom).isoWeek();
  const tomWeek = initializeDate(tom).isoWeek();
  if (fomWeek === tomWeek) {
    return `${fomWeek}`;
  }
  return `${fomWeek} - ${tomWeek}`;
}
