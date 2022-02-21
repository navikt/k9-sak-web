import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Percentage, Period } from '../../types/types.internal';

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

export const isOutOfBounds = (position: Percentage, width: number): boolean => position >= 100 || position + width < 0;

export const breddeMellomDatoer = (start: Dayjs, slutt: Dayjs, totaltAntallDatoer: number): Percentage => {
  const dagerMellomDatoer = slutt.diff(start, 'minute') / 60 / 24;
  return (dagerMellomDatoer / totaltAntallDatoer) * 100;
};

export const erLike = (p1: Period, p2?: Period) =>
  p2 && p1.start.isSame(p2.start) && p1.endInclusive.isSame(p2.endInclusive);

export const erDelAv = (p1: Period, p2?: Period) =>
  p2 && p1.start.isBefore(p2.start) && p1.endInclusive.isAfter(p2.endInclusive);

export const overlapper = (p1: Period, p2?: Period) =>
  p2 && p1.start.isSameOrBefore(p2.start) && p1.endInclusive.isSameOrAfter(p2.endInclusive);
