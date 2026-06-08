import type { k9_sak_typer_Periode as Periode } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { periodeStartsBefore, prettifyPeriode } from './utils';

export const getStringMedPerioder = (perioder: Periode[]): string => {
  if (perioder.length === 1) {
    return `perioden ${prettifyPeriode(perioder[0]!)}`;
  }

  let perioderString = '';
  perioder.forEach((periode, index) => {
    const prettyPeriod = prettifyPeriode(periode);
    if (index === 0) {
      perioderString = prettyPeriod;
    } else if (index === perioder.length - 1) {
      perioderString = `${perioderString} og ${prettyPeriod}`;
    } else {
      perioderString = `${perioderString}, ${prettyPeriod}`;
    }
  });

  return `periodene ${perioderString}`;
};

export const sortPeriodsByFomDate = (period1: Periode, period2: Periode): number => {
  if (periodeStartsBefore(period1, period2)) {
    return 1;
  }
  if (periodeStartsBefore(period2, period1)) {
    return -1;
  }
  return 0;
};
