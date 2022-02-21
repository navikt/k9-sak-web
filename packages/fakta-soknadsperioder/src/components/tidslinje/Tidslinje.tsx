import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { ReactNode, useCallback, useState } from 'react';
import Rad from '../../types/Rad';
import { Etikett, Periode, Pin } from '../../types/types.external';
import { AxisLabel, InternalSimpleTimeline, PositionedPeriod, Tidslinjeskala } from '../../types/types.internal';
import { AxisLabels } from './AxisLabels';
import { Pins } from './Pins';
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
            {rows.map((_, i) => (
              <EmptyTimelineRow key={i} />
            ))}
          </div>
          {pins && <Pins pins={pins} start={start} slutt={endInclusive} direction={direction} />}
          {rows.map((tidslinje, i) => (
            <div key={tidslinje.id} className={`${styles.radContainer} ${tidslinje.radClassname || ''}`}>
              <p className={styles.radLabel}>{tidslinje.radLabel}</p>
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
    sluttDato,
    etikettRender,
    onSelectPeriode,
    retning = 'stigende',
  }: TidslinjeProps) => {
    const [tidslinjeSkala, setTidslinjeSkala] = useState<Tidslinjeskala>(6);
    if (!rader) throw new Error('Tidslinjen mangler rader.');

    const direction = retning === 'stigende' ? 'left' : 'right';
    const start = useTidligsteDato({ startDato, rader }).startOf('month');
    const endInclusive = dayjs(start).add(tidslinjeSkala, 'month').endOf('day');
    const rows = useTidslinjerader(rader, start, endInclusive, direction);
    const getPins = () => {
      const monthPins = [{ date: start.toDate(), classname: '' }];
      if (tidslinjeSkala === 6) {
        // const endDate = start.add(6, 'month');
        // for (let index = 1; index <= endDate.diff(start, 'week'); index++) {
        //   monthPins.push({
        //     date: start.add(index, 'week').toDate(),
        //     classname: index % 4 !== 0 ? styles.monthPin : '',
        //   });
        // }
        // const endDate = start.add(6, 'month');
        for (let x = 0; x <= 6; x++) {
          const thisMonth = start.add(x, 'month');
          const interval = thisMonth.daysInMonth() / 4;
          if (x !== 6) {
            for (let y = 1; y < 4; y++) {
              monthPins.push({
                date: thisMonth.add(Math.ceil(interval * y), 'day').toDate(),
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
        for (let index = 1; index <= tidslinjeSkala; index++) {
          monthPins.push({ date: start.add(index, 'month').startOf('month').toDate(), classname: '' });
        }
      }
      return monthPins;
    };

    const getSkalaRadio = (label: string, value: Tidslinjeskala) => (
      <label className={`${styles.skalaRadio} ${tidslinjeSkala === value ? styles['skalaRadio--selected'] : ''}`}>
        <Normaltekst>{label}</Normaltekst>
        <input onChange={() => setTidslinjeSkala(value)} type="radio" name="skala" value={value} />
      </label>
    );

    return (
      <div>
        <div className={styles.skalavelgerContainer}>
          <fieldset>
            <legend>Velg skala for visning</legend>
            {getSkalaRadio('6 mnd', 6)}
            {getSkalaRadio('1 år', 12)}
            {getSkalaRadio('3 år', 36)}
          </fieldset>
        </div>
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
