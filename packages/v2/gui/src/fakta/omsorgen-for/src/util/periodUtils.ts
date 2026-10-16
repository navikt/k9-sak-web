import type { Periode } from '@k9-sak-web/backend/k9sak/kontrakt/Periode.js';
import { Period } from '@k9-sak-web/gui/utils/Period.js';

const prettifyPeriode = (periode: Periode) => new Period(periode.fom, periode.tom).prettifyPeriod();

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
