import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const position = (date: dayjs.Dayjs, start: dayjs.Dayjs, endInclusive: dayjs.Dayjs) => {
  const diff = endInclusive.diff(start);
  return (date.diff(start) / diff) * 100;
};

export const horizontalPositionAndWidth = (
  start: dayjs.Dayjs,
  endInclusive: dayjs.Dayjs,
  timelineStart: dayjs.Dayjs,
  timelineEndInclusive: dayjs.Dayjs,
) => {
  const horizontalPosition = position(start, timelineStart, timelineEndInclusive);
  const width = position(endInclusive, timelineStart, timelineEndInclusive) - horizontalPosition;
  return {
    horizontalPosition,
    width,
  };
};
