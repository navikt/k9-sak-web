import Period from '../types/Period';

// eslint-disable-next-line import/prefer-default-export
export const sortPeriodsByNewest = (period1: Period, period2: Period): number => {
  if (period1.startsBefore(period2)) {
    return 1;
  }
  if (period2.startsBefore(period1)) {
    return -1;
  }
  return 0;
};

export const sortPeriodsChronological = (period1: Period, period2: Period): number => {
  if (period1.startsBefore(period2)) {
    return -1;
  }
  if (period2.startsBefore(period1)) {
    return 1;
  }
  return 0;
};
