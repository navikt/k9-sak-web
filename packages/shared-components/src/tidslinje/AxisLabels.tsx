import React, { ReactNode } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import classNames from 'classnames';
import styles from './AxisLabels.less';
import { erSynlig } from './filter';
import { horizontalPositionAndWidth } from './calc';
import { AxisLabel } from '../../types/types.internal';
import 'dayjs/locale/nb';

dayjs.locale('nb');

const formatertDag = (dato: Dayjs): string => dato.format('DD.MM');

const formatertMåned = (dato: Dayjs): string => {
  const månedLabel = dato.format('MMM');
  return månedLabel[0].toUpperCase().concat(månedLabel.slice(1, 3));
};

const formatertÅr = (dato: Dayjs): string => `${dato.year()}`;

export const dagsetiketter = (
  start: Dayjs,
  slutt: Dayjs,
  totaltAntallDager: number,
  direction: 'left' | 'right',
): AxisLabel[] => {
  const inkrement = Math.ceil(totaltAntallDager / 10);
  const sisteDag = slutt.startOf('day');
  return new Array(totaltAntallDager)
    .fill(sisteDag)
    .map((denneDagen, i) => {
      if (i % inkrement !== 0) return null;
      const dag: Dayjs = denneDagen.subtract(i, 'day');
      const { horizontalPosition, width } = horizontalPositionAndWidth(dag, dag.add(1, 'day'), start, slutt);
      return {
        direction,
        horizontalPosition,
        label: formatertDag(dag),
        date: dag.toDate(),
        width,
      };
    })
    .filter(etikett => etikett !== null) as AxisLabel[];
};

export const månedsetiketter = (start: Dayjs, slutt: Dayjs, direction: 'left' | 'right'): AxisLabel[] => {
  const startmåned = start.startOf('month');
  const sluttmåned = slutt.endOf('month');
  const antallMåneder = sluttmåned.diff(startmåned, 'month') + 1;
  return new Array(antallMåneder).fill(startmåned).map((denneMåneden, i) => {
    const måned: Dayjs = denneMåneden.add(i, 'month');
    const { horizontalPosition, width } = horizontalPositionAndWidth(måned, måned.add(1, 'month'), start, slutt);
    return {
      direction,
      horizontalPosition,
      label: formatertMåned(måned),
      date: måned.toDate(),
      width,
    };
  });
};

export const årsetiketter = (start: Dayjs, slutt: Dayjs, direction: 'left' | 'right'): AxisLabel[] => {
  const førsteÅr = start.startOf('year');
  const sisteÅr = slutt.endOf('year');
  const antallÅr = sisteÅr.diff(start, 'year') + 1;
  return new Array(antallÅr).fill(førsteÅr).map((detteÅret, i) => {
    const år: Dayjs = detteÅret.add(i, 'year');
    const { horizontalPosition, width } = horizontalPositionAndWidth(år, år.add(1, 'year'), start, slutt);
    return {
      direction,
      horizontalPosition,
      label: formatertÅr(år),
      date: år.toDate(),
      width,
    };
  });
};

const axisLabels = (start: Dayjs, slutt: Dayjs, direction: 'left' | 'right'): AxisLabel[] => {
  const totaltAntallDager = slutt.diff(start, 'day');
  if (totaltAntallDager < 40) {
    return dagsetiketter(start, slutt, totaltAntallDager, direction);
  }
  if (totaltAntallDager < 370) {
    return månedsetiketter(start, slutt, direction);
  }
  return årsetiketter(start, slutt, direction);
};

interface AxisLabelsProps {
  start: Dayjs;
  slutt: Dayjs;
  direction?: 'left' | 'right';
  etikettRender?: (etikett: AxisLabel) => ReactNode;
}

export const AxisLabels = ({ start, slutt, direction = 'left', etikettRender }: AxisLabelsProps) => {
  const labels = axisLabels(start, slutt, direction).filter(erSynlig);
  return (
    <div className={classNames('etiketter', styles.etiketter)}>
      {labels.map(etikett => (
        <div
          key={etikett.date.toISOString()}
          style={{
            display: 'flex',
            justifyContent: direction === 'left' ? 'flex-start' : 'flex-end',
            [direction]: `${etikett.horizontalPosition}%`,
            width: `${etikett.width}%`,
          }}
        >
          {etikettRender?.(etikett) ?? etikett.label}
        </div>
      ))}
    </div>
  );
};
