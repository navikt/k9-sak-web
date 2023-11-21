import { getArrayDifference, makeArrayWithoutDuplicates } from '../arrayUtils';
import { dateStringSorter, isDayAfter } from '../date-utils/dateComparison';
import initializeDate from '../date-utils/initialize';
import Period from './Period';

export function getPeriodsAsListOfDays(period: Period[]): string[] {
  const days = period.map(p => p.asListOfDays()).flat();
  return makeArrayWithoutDuplicates(days);
}

function getDaySequencesAsListOfPeriods(daySequences: string[][]): Period[] {
  return daySequences.map(daySequence => {
    const firstDay = daySequence[0];
    const lastDay = daySequence[daySequence.length - 1];
    return new Period(firstDay, lastDay);
  });
}

// assumes no duplicates & sorted by day
export function convertListOfDaysToPeriods(days: string[]): Period[] {
  if (days.length === 0) {
    return [];
  }

  const daySplit = [];
  let currentSplit = [];
  for (let i = 0; i < days.length; i += 1) {
    const currentSplitCount = currentSplit.length;
    if (currentSplitCount === 0) {
      currentSplit.push(days[i]);
    } else {
      const currentDay = initializeDate(days[i]);
      const previousDay = initializeDate(currentSplit[currentSplitCount - 1]);
      if (isDayAfter(previousDay, currentDay)) {
        currentSplit.push(days[i]);
      } else {
        daySplit.push(currentSplit);
        currentSplit = [days[i]];
      }
    }
  }
  daySplit.push(currentSplit);

  return getDaySequencesAsListOfPeriods(daySplit);
}

function periodDifference(basePeriods: Period[], periodsToExclude: Period[]): Period[] {
  const baseListOfDays = getPeriodsAsListOfDays(basePeriods).sort(dateStringSorter);
  const daysToExclude = getPeriodsAsListOfDays(periodsToExclude).sort(dateStringSorter);
  const daysToInclude = getArrayDifference(baseListOfDays, daysToExclude);
  return convertListOfDaysToPeriods(daysToInclude);
}

export default periodDifference;
