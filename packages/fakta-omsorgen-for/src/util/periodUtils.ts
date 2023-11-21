import { Period } from '@navikt/k9-fe-period-utils';

export const getStringMedPerioder = (perioder: Period[]): string => {
  if (perioder.length === 1) {
    return `perioden ${perioder[0].prettifyPeriod()}`;
  }

  let perioderString = '';
  perioder.forEach((periode, index) => {
    const prettyPeriod = periode.prettifyPeriod();
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

export const sortPeriodsByFomDate = (period1: Period, period2: Period): number => {
  if (period1.startsBefore(period2)) {
    return 1;
  }
  if (period2.startsBefore(period1)) {
    return -1;
  }
  return 0;
};
