import { PositionedPeriod } from '@k9-sak-web/types/src/tidslinje';
import dayjs from 'dayjs';

export const sisteDato = (a: dayjs.Dayjs, b: dayjs.Dayjs): number => b.diff(a);

export const sistePeriode = (a: PositionedPeriod, b: PositionedPeriod): number =>
  a.horizontalPosition - b.horizontalPosition;
