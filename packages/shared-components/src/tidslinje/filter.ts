import { Dayjs } from 'dayjs';
import { Positioned, Spatial } from '@k9-sak-web/types/src/tidslinje';

export const erSynlig = ({ horizontalPosition }: Positioned): boolean =>
  horizontalPosition <= 100 && horizontalPosition >= 0;

export const innenEtDøgn = (dato1: Dayjs, dato2: Dayjs): boolean => Math.abs(dato1.diff(dato2, 'day')) <= 1;

export const invisiblePeriods = ({ horizontalPosition, width }: Positioned & Spatial) =>
  horizontalPosition >= 0 && horizontalPosition <= 100 && width > 0;
