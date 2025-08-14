import type { k9_sak_kontrakt_person_PersonopplysningDto as PersonopplysningDto } from '@k9-sak-web/backend/k9sak/generated';
import { calcDaysAndWeeksWithWeekends } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { DDMMYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { Timeline, VStack } from '@navikt/ds-react';
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
  const getArbeidsgiverAndeler = () => {
    let arbeidsgiverAndeler = '';
    (item.andeler || []).forEach((andel, index) => {
      arbeidsgiverAndeler += `${index > 0 ? ', ' : ''}${createArbeidsgiverVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId)}: ${Number(andel.refusjon) + Number(andel.tilSoker)} kr`;
    });
    return arbeidsgiverAndeler;
  };
  return `${periodeDato}
${calcDaysAndWeeksWithWeekends(initializeDate(item.fom), initializeDate(item.tom))}
${`Dagsats: ${item.dagsats}kr`}
${getArbeidsgiverAndeler()}`;
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

const finnRolle = (personopplysninger: PersonopplysningDto): string =>
  personopplysninger.navn ? personopplysninger.navn : 'Søker';

interface OwnProps {
  items: PeriodeMedId[];
  kodeverkNavnFraKode: (kode: string, kodeverkType: KodeverkType) => string;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  personopplysninger: PersonopplysningDto;
  showAndelDetails?: boolean;
}

/**
 * TilkjentYtelse
 *
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for tilkjent ytelse
 */

export const TilkjentYtelse = ({
  arbeidsgiverOpplysningerPerId,
  items,
  kodeverkNavnFraKode,
  personopplysninger,
  showAndelDetails,
}: OwnProps) => {
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
        <VStack gap="2">
          <Timeline startDate={startDato.toDate()} endDate={endDato.add(1, 'days').toDate()}>
            <Timeline.Row label={finnRolle(personopplysninger)}>
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

          <TimeLineControl
            goBackwardCallback={goBackward}
            goForwardCallback={goForward}
            zoomInCallback={zoomIn}
            zoomOutCallback={zoomOut}
            openPeriodInfo={openPeriodInfo}
            selectedPeriod={!!valgtPeriode}
          />
        </VStack>
        {valgtPeriode && (
          <TilkjentYtelseTimelineData
            selectedItemStartDate={valgtPeriode.fom?.toString() ?? ''}
            selectedItemEndDate={valgtPeriode.tom?.toString() ?? ''}
            selectedItemData={valgtPeriode}
            callbackForward={nextPeriod}
            callbackBackward={prevPeriod}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
            showAndelDetails={showAndelDetails}
          />
        )}
      </div>
    </div>
  );
};

export default TilkjentYtelse;
