import { Period } from '@fpsak-frontend/utils';
import { getPeriodDifference } from './dateUtils';

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

export const finnResterendePerioder = (perioderFraForm: Period[], periodeTilVurdering: Period): Period[] => {
  const formatertePerioderFraForm = perioderFraForm.map(periode => {
    if ((periode as any).period) {
      return (periode as any).period;
    }
    return periode;
  });
  const resterendePerioder =
    formatertePerioderFraForm.length > 0 &&
    getPeriodDifference(periodeTilVurdering, formatertePerioderFraForm as Period[]);

  return resterendePerioder;
};
