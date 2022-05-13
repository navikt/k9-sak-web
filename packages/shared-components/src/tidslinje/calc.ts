import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const position = (date: Dayjs, start: Dayjs, endInclusive: Dayjs) => {
  const diff = endInclusive.diff(start);
  return (date.diff(start) / diff) * 100;
};

export const horizontalPositionAndWidth = (
  start: Dayjs,
  endInclusive: Dayjs,
  timelineStart: Dayjs,
  timelineEndInclusive: Dayjs,
) => {
  const horizontalPosition = position(start, timelineStart, timelineEndInclusive);
  const width = position(endInclusive, timelineStart, timelineEndInclusive) - horizontalPosition;
  return {
    horizontalPosition,
    width,
  };
};
