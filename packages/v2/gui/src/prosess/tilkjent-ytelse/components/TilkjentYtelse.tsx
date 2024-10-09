import { calcDaysAndWeeksWithWeekends } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { DDMMYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { Timeline } from '@navikt/ds-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import type { BeregningsresultatPeriodeDto } from '../types/BeregningsresultatPeriodeDto';
import type { ArbeidsgiverOpplysningerPerId } from '../types/arbeidsgiverOpplysningerType';
import { createArbeidsgiverVisningsnavnForAndel } from './TilkjentYteleseUtils';
import TilkjentYtelseTimelineData from './TilkjentYtelseTimelineData';
import styles from './tilkjentYtelse.module.css';
import TimeLineControl from './timeline/TimeLineControl';

export type PeriodeMedId = BeregningsresultatPeriodeDto & { id: number };

const parseDateString = (dateString: string) => initializeDate(dateString, ISO_DATE_FORMAT).toDate();

const createTooltipContent = (
  item: PeriodeMedId,
  getKodeverknavn: (kode: string, kodeverkType: KodeverkType) => string,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
) => {
  const periodeDato = `${initializeDate(item.fom).format(DDMMYY_DATE_FORMAT)} - ${initializeDate(item.tom).format(DDMMYY_DATE_FORMAT)}`;
  return `${periodeDato}
${calcDaysAndWeeksWithWeekends(initializeDate(item.fom), initializeDate(item.tom))}
${`Dagsats: ${item.dagsats}kr`}
${
  (item.andeler || []).length > 1
    ? item.andeler
        .map(andel => {
          `${createArbeidsgiverVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId)}: ${Number(andel.refusjon) + Number(andel.tilSoker)} kr`;
        })
        .join(' ')
    : ''
}`;
};

const sumUtBetalingsgrad = (andeler: PeriodeMedId['andeler']) =>
  andeler.reduce((sum, andel) => sum + (andel.utbetalingsgrad ?? 0), 0);

const erTotalUtbetalingsgradOver100 = (periode: PeriodeMedId) => {
  const values = [
    periode.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt,
    periode.totalUtbetalingsgradFraUttak,
  ].filter((value): value is number => value !== null && value !== undefined);

  if (values.length > 0) {
    const totalUtbetalingsgrad = Math.min(...values) * 100;
    return totalUtbetalingsgrad >= 100;
  }

  // Resten av koden i denne funksjonen kan fjernes når alle saker har totalUtbetalingsgradFraUttak.
  // Denne koden er kun for å støtte saker som er laget før totalUtbetalingsgradFraUttak ble lagt til.
  if (periode.andeler) {
    const totalUtbetalingsgrad = sumUtBetalingsgrad(periode.andeler);
    return totalUtbetalingsgrad >= 100;
  }
  return false;
};

const prepareTimelineData = (
  periode: PeriodeMedId,
  index: number,
  getKodeverknavn: (kode: string, kodeverkType: KodeverkType) => string,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
) => ({
  ...periode,
  className: erTotalUtbetalingsgradOver100(periode) ? 'innvilget' : 'gradert',
  group: 1,
  id: index,
  start: parseDateString(periode.fom),
  end: initializeDate(periode.tom).add(1, 'day').toDate(),
  title: createTooltipContent(periode, getKodeverknavn, arbeidsgiverOpplysningerPerId),
  content: '',
});

interface OwnProps {
  items: PeriodeMedId[];
  groups: {
    id: number;
    content: string;
  }[];
  kodeverkNavnFraKode: (kode: string, kodeverkType: KodeverkType) => string;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

/**
 * TilkjentYtelse
 *
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for tilkjent ytelse
 */

export const TilkjentYtelse = ({ arbeidsgiverOpplysningerPerId, items, kodeverkNavnFraKode }: OwnProps) => {
  const [valgtPeriode, setValgtPeriode] = useState<PeriodeMedId | null>();
  const timelineData = items.map((periode, index) =>
    prepareTimelineData(periode, index, kodeverkNavnFraKode, arbeidsgiverOpplysningerPerId),
  );
  const originalStartDato = dayjs(timelineData[0]?.start);
  const originalEndDato = dayjs(timelineData[timelineData.length - 1]?.end);

  const [startDato, setStartDato] = useState(originalStartDato);
  const [endDato, setEndDato] = useState(originalEndDato);

  const openPeriodInfo = () => {
    if (valgtPeriode) {
      setValgtPeriode(null);
    } else {
      setValgtPeriode(items[0]);
    }
  };

  const nextPeriod = () => {
    const newIndex = items.findIndex(item => item.id === valgtPeriode?.id) + 1;
    if (newIndex < items.length) {
      const selectedItem = items[newIndex];
      setValgtPeriode(selectedItem);
    }
  };

  const prevPeriod = () => {
    const newIndex = items.findIndex(item => item.id === valgtPeriode?.id) - 1;
    if (newIndex >= 0) {
      const selectedItem = items[newIndex];
      setValgtPeriode(selectedItem);
    }
  };

  const selectHandler = (id: number) => {
    const selectedItem = items.find(item => item.id === id);
    setValgtPeriode(selectedItem);
  };

  const zoomIn = () => {
    if (!startDato.add(2, 'month').isAfter(endDato)) {
      setStartDato(startDato.add(1, 'month'));
      setEndDato(endDato.subtract(1, 'month'));
    }
  };

  const zoomOut = () => {
    if (endDato.add(1, 'month').diff(startDato.subtract(1, 'month'), 'months') < 36) {
      setStartDato(startDato.subtract(1, 'month'));
      setEndDato(endDato.add(1, 'month'));
    }
  };

  const goForward = () => {
    if (!endDato.add(1, 'month').isAfter(originalEndDato)) {
      setStartDato(startDato.add(1, 'month'));
      setEndDato(endDato.add(1, 'month'));
    }
  };

  const goBackward = () => {
    if (!startDato.subtract(1, 'month').isBefore(originalStartDato)) {
      setStartDato(startDato.subtract(1, 'month'));
      setEndDato(endDato.subtract(1, 'month'));
    }
  };

  return (
    <div className={styles['timelineContainer']}>
      <div className="mt-8">
        <div className={styles['timeLineWrapper']}>
          <Timeline startDate={startDato.toDate()} endDate={endDato.add(1, 'days').toDate()}>
            <Timeline.Row label="Test">
              {timelineData.map(periode => (
                <Timeline.Period
                  key={periode.id}
                  id={`${periode.id}`}
                  start={periode.start}
                  end={periode.end}
                  title={periode.title}
                  className={periode.className}
                  onSelectPeriod={() => selectHandler(periode.id)}
                  isActive={valgtPeriode?.id === periode.id}
                />
              ))}
            </Timeline.Row>
          </Timeline>
        </div>

        <TimeLineControl
          goBackwardCallback={goBackward}
          goForwardCallback={goForward}
          zoomInCallback={zoomIn}
          zoomOutCallback={zoomOut}
          openPeriodInfo={openPeriodInfo}
        />
        {valgtPeriode && (
          <TilkjentYtelseTimelineData
            selectedItemStartDate={valgtPeriode.fom?.toString() ?? ''}
            selectedItemEndDate={valgtPeriode.tom?.toString() ?? ''}
            selectedItemData={valgtPeriode}
            callbackForward={nextPeriod}
            callbackBackward={prevPeriod}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          />
        )}
      </div>
    </div>
  );
};

export default TilkjentYtelse;
