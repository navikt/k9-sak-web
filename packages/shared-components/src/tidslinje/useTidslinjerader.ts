import { InternalSimpleTimeline, ExpandedPeriode as Periode, PositionedPeriod } from '@k9-sak-web/types/src/tidslinje';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Rad from './Rad';
import { horizontalPositionAndWidth } from './calc';
import { innenEtDøgn, invisiblePeriods } from './filter';
import { sistePeriode } from './sort';
import { TidslinjeProps } from './Tidslinje';

const spatialPeriod = (
  period: Periode,
  timelineStart: Dayjs,
  timelineEndInclusive: Dayjs,
  direction: 'left' | 'right' = 'left',
): PositionedPeriod => {
  const start = dayjs(period.fom);
  const endInclusive = dayjs(period.tom);
  const { horizontalPosition, width } = horizontalPositionAndWidth(
    start.startOf('day'),
    endInclusive.endOf('day'),
    timelineStart,
    timelineEndInclusive,
  );
  return {
    id: period.id || uuidv4(),
    start,
    endInclusive,
    horizontalPosition,
    hoverLabel: period.hoverLabel,
    direction,
    className: period.className,
    disabled: period.disabled,
    status: period.status,
    active: period.active,
    infoPin: period.infoPin,
    radLabel: period.radLabel,
    width,
  };
};

const adjustedEdges = (period: PositionedPeriod, i: number, allPeriods: PositionedPeriod[]): PositionedPeriod => {
  const left = i > 0 && innenEtDøgn(allPeriods[i - 1].endInclusive, period.start);
  const right = i < allPeriods.length - 1 && innenEtDøgn(period.endInclusive, allPeriods[i + 1].start);
  if (left && right) {
    return { ...period, cropped: 'both' };
  }
  if (left) {
    return { ...period, cropped: 'left' };
  }
  if (right) {
    return { ...period, cropped: 'right' };
  }
  return period;
};

const trimmedPeriods = (period: PositionedPeriod) => {
  let { horizontalPosition, width, cropped } = period;
  if (horizontalPosition + width > 100) {
    width = 100 - horizontalPosition;
    cropped = cropped === 'left' || cropped === 'both' ? 'both' : 'right';
  }
  if (horizontalPosition < 0 && horizontalPosition + width > 0) {
    width = horizontalPosition + width;
    horizontalPosition = 0;
    cropped = cropped === 'right' || cropped === 'both' ? 'both' : 'left';
  }
  return {
    ...period,
    width,
    horizontalPosition,
    cropped,
  };
};

export const useTidslinjerader = (
  rader: Rad[],
  startDato: Dayjs,
  sluttDato: Dayjs,
  direction: 'left' | 'right',
): InternalSimpleTimeline[] =>
  useMemo(
    () =>
      rader.map(({ perioder, radLabel, radClassname, onClick, emptyRowClassname }) => {
        const tidslinjeperioder = perioder
          .map((periode: Periode) => spatialPeriod(periode, startDato, sluttDato, direction))
          .sort(sistePeriode)
          .map(adjustedEdges)
          .map(trimmedPeriods)
          .filter(invisiblePeriods);

        return {
          radClassname,
          radLabel,
          id: uuidv4(),
          periods: direction === 'left' ? tidslinjeperioder : [...tidslinjeperioder].reverse(),
          onClick,
          emptyRowClassname,
        };
      }),
    [rader, startDato, sluttDato],
  );

const tidligsteDato = (tidligst: Date, periode: Periode) => periode.fom < tidligst ? periode.fom : tidligst;
const senesteDato = (senest: Date, periode: Periode) => periode.tom > senest ? periode.tom : senest;

const tidligsteFomDato = (rader: Periode[][]) => rader.flat().reduce(tidligsteDato, new Date());

const senesteTomDato = (rader: Periode[][]) => rader.flat().reduce(senesteDato, null);

export const useTidligsteDato = ({ startDato, rader }: TidslinjeProps) =>
  startDato ? dayjs(startDato) : dayjs(tidligsteFomDato(rader.map(rad => rad.perioder)));

export const useSenesteDato = ({ sluttDato, rader }: TidslinjeProps) =>
  sluttDato ? dayjs(sluttDato) : dayjs(senesteTomDato(rader.map(rad => rad.perioder)));
