import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import React, { ReactNode, useCallback } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import Rad from '../../types/Rad';
import { Etikett, Periode, Pin } from '../../types/types.external';
import { AxisLabel, InternalSimpleTimeline, PositionedPeriod, Tidslinjeskala } from '../../types/types.internal';
import { AxisLabels } from './AxisLabels';
import Pins from './Pins';
import styles from './Tidslinje.less';
import { EmptyTimelineRow, TimelineRow } from './TimelineRow';
import { useTidligsteDato, useTidslinjerader } from './useTidslinjerader';

export interface TidslinjeProps {
  /**
   * Perioder som rendres på tidslinjen. Rendres som 'button' dersom 'onSelectPeriode' er satt, ellers som en 'div'.
   * Hver liste av `Periode`-objekter representerer en egen rad i tidslinjen.
   */
  rader: Rad[];
  /**
   * Bestemmer startpunktet for tidslinjen. Defaulter til tidligste dato blandt alle perioder i tidslinjen.
   */
  startDato?: Date;
  /**
   * Bestemmer sluttpunktet for tidslinjen. Defaulter til seneste dato blandt alle perioder i tidslinjen.
   */
  sluttDato?: Date;
  /**
   * Handling som skal skje når en bruker klikker på/interagerer med en periodeknapp.
   */
  onSelectPeriode?: (periode: Periode) => void;
  /**
   * Raden som skal markeres som aktiv.
   */
  aktivRad?: number;
  /**
   * Retningen periodene sorteres på. Default er 'stigende', hvor tidligste periode da vil rendres til venstre i
   * tidslinjen og seneste periode vil rendres til høyre.
   */
  retning?: 'stigende' | 'synkende';
  /**
   * Funksjon som tar en etikett og returnerer det som skal rendres.
   */
  etikettRender?: (etikett: Etikett) => ReactNode;
  /**
   * Markeringer for enkeltdager på tidslinjen.
   */
  pins?: Pin[];
  tidslinjeSkala?: Tidslinjeskala;
}

export interface TimelineProps {
  rows: InternalSimpleTimeline[];
  start: Dayjs;
  direction: 'left' | 'right';
  endInclusive: Dayjs;
  activeRow?: number;
  onSelectPeriod?: (periode: Periode) => void;
  axisLabelRenderer?: (etikett: AxisLabel) => ReactNode;
  pins?: Pin[];
}

const Timeline = React.memo(
  ({ pins, rows, start, endInclusive, onSelectPeriod, activeRow, direction, axisLabelRenderer }: TimelineProps) => {
    const onSelectPeriodeWrapper =
      onSelectPeriod &&
      useCallback(
        (periode: PositionedPeriod) => {
          onSelectPeriod?.({
            id: periode.id,
            fom: periode.start.toDate(),
            tom: periode.endInclusive.toDate(),
            disabled: periode.disabled,
            status: periode.status,
          });
        },
        [onSelectPeriod],
      );
    return (
      <div className={classNames('tidslinje', styles.tidslinje)}>
        <AxisLabels start={start} slutt={endInclusive} direction={direction} etikettRender={axisLabelRenderer} />
        <div className={classNames('tidslinjerader', styles.rader)}>
          <div className={classNames(styles.emptyRows)}>
            {rows.map(tidslinje => (
              <EmptyTimelineRow className={`${tidslinje.emptyRowClassname || ''}`} key={tidslinje.id} />
            ))}
          </div>
          {pins && <Pins pins={pins} start={start} slutt={endInclusive} direction={direction} />}
          {rows.map((tidslinje, i) => (
            <div key={tidslinje.id} className={`${styles.radContainer} ${tidslinje.radClassname || ''}`}>
              {tidslinje.onClick ? (
                <button onClick={tidslinje.onClick} type="button" className={styles.radLabel}>
                  <Normaltekst tag="span">{tidslinje.radLabel}</Normaltekst>
                </button>
              ) : (
                <Normaltekst className={styles.radLabel}>{tidslinje.radLabel}</Normaltekst>
              )}
              <TimelineRow {...tidslinje} onSelectPeriod={onSelectPeriodeWrapper} active={i === activeRow} />
            </div>
          ))}
        </div>
      </div>
    );
  },
);

/**
 * Viser perioder i en tidslinje.
 */
export const Tidslinje = React.memo(
  ({
    pins,
    rader,
    aktivRad,
    startDato,
    etikettRender,
    onSelectPeriode,
    tidslinjeSkala,
    retning = 'stigende',
  }: TidslinjeProps) => {
    if (!rader) throw new Error('Tidslinjen mangler rader.');

    const direction = retning === 'stigende' ? 'left' : 'right';
    const start = useTidligsteDato({ startDato, rader }).startOf('month');
    const endInclusive = dayjs(start).add(tidslinjeSkala, 'month').endOf('day');
    const rows = useTidslinjerader(rader, start, endInclusive, direction);
    const getPins = () => {
      const monthPins = [{ date: start.toDate(), classname: '' }];
      if (tidslinjeSkala === 6) {
        for (let x = 0; x <= 6; x += 1) {
          const currentMonth = start.add(x, 'month');
          const interval = currentMonth.daysInMonth() / 4;
          if (x !== 6) {
            for (let y = 1; y < 4; y += 1) {
              monthPins.push({
                date: currentMonth.add(Math.ceil(interval * y), 'day').toDate(),
                classname: styles.weekPin,
              });
            }
          }
          monthPins.push({
            date: start.add(x, 'month').startOf('month').toDate(),
            classname: '',
          });
        }
      } else {
        for (let index = 1; index <= tidslinjeSkala; index += 1) {
          monthPins.push({ date: start.add(index, 'month').startOf('month').toDate(), classname: '' });
        }
      }
      return monthPins;
    };

    return (
      <div>
        <Timeline
          rows={rows}
          start={start}
          activeRow={aktivRad}
          direction={direction}
          endInclusive={endInclusive}
          onSelectPeriod={onSelectPeriode}
          axisLabelRenderer={etikettRender}
          pins={pins?.length > 0 ? pins : getPins()}
        />
      </div>
    );
  },
);
