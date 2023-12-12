import { Period, initializeDate, isSameOrBefore, sortPeriodsByFomDate } from '@fpsak-frontend/utils';

const checkIfPeriodsAreEdgeToEdge = (period, otherPeriod) => {
  const dayAfterPeriod = initializeDate(period.tom).add(1, 'day');
  const startOfNextPeriod = initializeDate(otherPeriod.fom);
  return dayAfterPeriod.isSame(startOfNextPeriod);
};

export const slåSammenSammenhengendePerioder = (periods: Period[]): Period[] => {
  if (!periods || periods.length === 0) {
    return [];
  }

  const sortedPeriods = periods.sort((p1, p2) => sortPeriodsByFomDate(p1, p2));
  const combinedPeriods: Period[] = [];

  const getFirstDate = (date1: string, date2: string) => {
    if (isSameOrBefore(date1, date2)) {
      return date1;
    }

    return date2;
  };

  const getLastDate = (date1: string, date2: string) => {
    if (isSameOrBefore(date1, date2)) {
      return date2;
    }

    return date1;
  };

  const checkIfPeriodCanBeCombinedWithPreviousPeriod = (period: Period, previousPeriod?: Period) => {
    if (!previousPeriod) {
      return false;
    }
    const hasOverlapWithPreviousPeriod = previousPeriod.includesDate(period.fom);
    const periodsAreEdgeToEdge = checkIfPeriodsAreEdgeToEdge(previousPeriod, period);
    return hasOverlapWithPreviousPeriod || periodsAreEdgeToEdge;
  };

  const combinePeriods = (period, otherPeriod) => {
    const firstFom = getFirstDate(period.fom, otherPeriod.fom);
    const lastTom = getLastDate(period.tom, otherPeriod.tom);
    const combinedPeriod = new Period(firstFom, lastTom);
    return combinedPeriod;
  };

  const addToListIfNotAdded = (period: Period) => {
    const previousPeriod = combinedPeriods[combinedPeriods.length - 1];
    const canBeCombinedWithPreviousPeriod = checkIfPeriodCanBeCombinedWithPreviousPeriod(period, previousPeriod);

    if (canBeCombinedWithPreviousPeriod) {
      const combinedPeriod = combinePeriods(period, previousPeriod);
      combinedPeriods[combinedPeriods.length - 1] = combinedPeriod;
    } else {
      combinedPeriods.push(period);
    }
  };

  const periodsToSkip = [];

  const maybeCombinePeriods = (period, nextPeriod, index, array, previouslySkippedCounter = 0) => {
    if (nextPeriod) {
      const hasOverlapWithNextPeriod = nextPeriod.includesDate(period.tom);
      const periodsAreEdgeToEdge = checkIfPeriodsAreEdgeToEdge(period, nextPeriod);
      if (hasOverlapWithNextPeriod || periodsAreEdgeToEdge) {
        const combinedPeriod = combinePeriods(period, nextPeriod);
        periodsToSkip.push(nextPeriod);
        const periodsToSkipCounter = previouslySkippedCounter + 1;
        const next = array[index + periodsToSkipCounter];
        if (next) {
          maybeCombinePeriods(combinedPeriod, next, index, array, periodsToSkipCounter);
        } else {
          combinedPeriods.push(combinedPeriod);
        }
      } else {
        addToListIfNotAdded(period);
      }
    } else {
      addToListIfNotAdded(period);
    }
  };

  sortedPeriods.forEach((period, index, array) => {
    const nextPeriod = array[index + 1];
    if (!periodsToSkip.includes(nextPeriod)) {
      maybeCombinePeriods(period, nextPeriod, index, array);
    }
  });
  return combinedPeriods;
};

export const finnHullIPerioder = (periode: Period[]): Period[] => {
  const hull: Period[] = [];
  const sortedPeriods = periode.sort((p1, p2) => sortPeriodsByFomDate(p1, p2));

  sortedPeriods.forEach((period, index, array) => {
    const nextPeriod = array[index + 1];
    if (nextPeriod) {
      if (!checkIfPeriodsAreEdgeToEdge(period, nextPeriod) && !nextPeriod.includesDate(period.tom)) {
        const dayAfterPeriod = initializeDate(period.tom).add(1, 'day').format('YYYY-MM-DD');
        const dayBeforeStartOfNextPeriod = initializeDate(nextPeriod.fom).subtract(1, 'day').format('YYYY-MM-DD');
        const nyttHull = new Period(dayAfterPeriod, dayBeforeStartOfNextPeriod);
        hull.push(nyttHull);
      }
    }
  });
  return hull;
};

export const finnMaksavgrensningerForPerioder = (perioder: Period[]): Period => {
  let maksimalSøknadsperiode: Period = null;
  perioder.forEach(periode => {
    let nyFom;
    let nyTom;
    if (!maksimalSøknadsperiode) {
      maksimalSøknadsperiode = new Period(periode.fom, periode.tom);
    } else {
      if (periode.startsBefore(maksimalSøknadsperiode)) {
        nyFom = periode.fom;
      }

      if (periode.endsAfter(maksimalSøknadsperiode)) {
        nyTom = periode.tom;
      }

      if (nyFom || nyTom) {
        maksimalSøknadsperiode = new Period(nyFom || maksimalSøknadsperiode.fom, nyTom || maksimalSøknadsperiode.tom);
      }
    }
  });

  return maksimalSøknadsperiode;
};
