import type { Periode } from '@k9-sak-web/backend/k9sak/kontrakt/Periode.js';
import { combineConsecutivePeriods, findUncoveredDays } from '@k9-sak-web/lib/dateUtils/dateUtils.js';

const getPeriodDifference = (basePeriods: Periode[], periodsToExclude: Periode[]): Periode[] => {
  const daysToInclude = basePeriods.flatMap(period => findUncoveredDays(period, periodsToExclude));
  return combineConsecutivePeriods(daysToInclude);
};

export default getPeriodDifference;
