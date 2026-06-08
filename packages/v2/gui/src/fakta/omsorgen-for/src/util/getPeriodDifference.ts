import { type k9_sak_typer_Periode as Periode } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { getArrayDifference, makeArrayWithoutDuplicates } from './arrayUtils';
import { isDayAfter } from './dateComparison';
import { dateStringSorter } from './sort';
import { asListOfDays } from './utils';

export function getPeriodsAsListOfDays(period: Periode[]): string[] {
  const days = period.map(p => asListOfDays(p)).flat();
  return makeArrayWithoutDuplicates(days);
}

function getDaySequencesAsListOfPeriods(daySequences: string[][]): Periode[] {
  return daySequences
    .map(daySequence => {
      const firstDay = daySequence[0];
      const lastDay = daySequence[daySequence.length - 1];
      if (firstDay && lastDay) {
        return { fom: firstDay, tom: lastDay };
      }
      return undefined;
    })
    .filter((periode): periode is Periode => periode !== undefined);
}

// assumes no duplicates & sorted by day
export function convertListOfDaysToPeriods(days: string[]): Periode[] {
  if (days.length === 0) {
    return [];
  }

  const daySplit: string[][] = [];
  let currentSplit: string[] = [];
  for (let i = 0; i < days.length; i += 1) {
    const currentSplitCount = currentSplit.length;
    const currentDay = days[i];
    if (currentSplitCount === 0 && currentDay) {
      currentSplit.push(currentDay);
    } else {
      const previousDay = currentSplit[currentSplitCount - 1];
      if (previousDay && currentDay && isDayAfter(previousDay, currentDay)) {
        currentSplit.push(currentDay);
      } else {
        daySplit.push(currentSplit);
        if (currentDay) {
          currentSplit = [currentDay];
        }
      }
    }
  }
  daySplit.push(currentSplit);

  return getDaySequencesAsListOfPeriods(daySplit);
}

const getPeriodDifference = (basePeriods: Periode[], periodsToExclude: Periode[]): Periode[] => {
  const baseListOfDays = getPeriodsAsListOfDays(basePeriods).sort(dateStringSorter);
  const daysToExclude = getPeriodsAsListOfDays(periodsToExclude).sort(dateStringSorter);
  const daysToInclude = getArrayDifference(baseListOfDays, daysToExclude);
  return convertListOfDaysToPeriods(daysToInclude);
};

export default getPeriodDifference;
