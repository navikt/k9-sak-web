import Period from './Period';

const getHumanReadablePeriodString = (periods: Period[]): string => {
  if (periods.length === 1) {
    return periods[0].prettifyPeriod();
  }

  let periodString = '';
  periods.forEach((period, index) => {
    const prettifiedPeriod = period.prettifyPeriod();
    if (index === 0) {
      periodString = prettifiedPeriod;
    } else if (index === periods.length - 1) {
      periodString = `${periodString} og ${prettifiedPeriod}`;
    } else {
      periodString = `${periodString}, ${prettifiedPeriod}`;
    }
  });

  return periodString;
};

export default getHumanReadablePeriodString;
