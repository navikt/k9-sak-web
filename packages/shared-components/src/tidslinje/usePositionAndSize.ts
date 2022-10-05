/* eslint-disable import/prefer-default-export */
import dayjs, { Dayjs } from 'dayjs';
import { EnkelPeriode } from '@k9-sak-web/types/src/tidslinje';
import { horizontalPositionAndWidth } from './calc';

interface UsePositionAndSizeOptions {
  periode: EnkelPeriode;
  tidslinjestart: Dayjs;
  tidslinjeslutt: Dayjs;
  direction: 'left' | 'right';
}

const constrain = (value: number, min: number, max: number) => {
  if (value >= max) {
    return max;
  }
  if (value < min) {
    return min;
  }
  return value;
};

export const usePositionAndSize = ({
  periode,
  tidslinjestart,
  tidslinjeslutt,
  direction,
}: UsePositionAndSizeOptions) => {
  const fom = dayjs(periode.fom).startOf('day');
  const tom = dayjs(periode.tom).endOf('day');

  const { horizontalPosition, width } = horizontalPositionAndWidth(fom, tom, tidslinjestart, tidslinjeslutt);
  const adjustedHorizontalPosition = constrain(horizontalPosition, 0, 100);

  let adjustedWidth = width;

  if (adjustedHorizontalPosition + width >= 100) {
    adjustedWidth = 100 - adjustedHorizontalPosition;
  } else if (adjustedHorizontalPosition + width !== horizontalPosition + width) {
    adjustedWidth = width + horizontalPosition;
  }

  if (horizontalPosition >= 100 || adjustedWidth <= 0) {
    return {
      [direction]: 0,
      width: 0,
      display: 'none',
    };
  }
  if (horizontalPosition < 0) {
    return {
      [direction]: 0,
      width: `${adjustedWidth}%`,
    };
  }
  return {
    [direction]: `${adjustedHorizontalPosition}%`,
    width: `${adjustedWidth}%`,
    display: horizontalPosition > 100 ? 'none' : undefined,
  };
};
