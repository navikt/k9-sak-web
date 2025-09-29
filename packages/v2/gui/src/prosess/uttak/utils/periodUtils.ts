import type { k9_sak_typer_Periode as Periode } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';

export const sortPeriodsChronological = (period1: Periode, period2: Periode): number => {
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

export const sortPeriodsByNewest = (period1: Periode, period2: Periode): number => {
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
  return `${initializeDate(fom).startOf('week').week()} - ${initializeDate(tom).endOf('week').week()}`;
}
