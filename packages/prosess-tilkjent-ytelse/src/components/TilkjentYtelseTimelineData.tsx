import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { FloatRight, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { TimeLineButton, TimeLineDataContainer } from '@fpsak-frontend/tidslinje';
import { calcDaysAndWeeksWithWeekends, DDMMYYYY_DATE_FORMAT, getKodeverknavnFn } from '@fpsak-frontend/utils';
import { ArbeidsgiverOpplysningerPerId, KodeverkMedNavn } from '@k9-sak-web/types';
import { BodyShort, HGrid, Label, Tabs, Tag } from '@navikt/ds-react';
import moment from 'moment';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { createVisningsnavnForAndel, getAktivitet } from './TilkjentYteleseUtils';
import { PeriodeMedId } from './TilkjentYtelse';
import styles from './tilkjentYtelse.module.css';
import UtbetalingsgradDetaljer from './UtbetalingsgradDetaljer';

interface OwnProps {
  selectedItemStartDate: string;
  selectedItemEndDate: string;
  selectedItemData?: PeriodeMedId;
  callbackForward: (...args: any[]) => any;
  callbackBackward: (...args: any[]) => any;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

/**
 * TimeLineData
 *
 * Viser opp data fra valgt periode i tilkjent ytelse-tidslinjen
 */

const desimalerTilProsent = (value: number) => {
  const percentage = value * 100;
  const percentageString = percentage.toFixed(2);
  return percentageString.replace(/\.00$/, '');
};
const TilkjentYtelseTimeLineData = ({
  selectedItemStartDate,
  selectedItemEndDate,
  selectedItemData,
  callbackForward,
  callbackBackward,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
}: OwnProps) => {
  const { andeler } = selectedItemData;
  const [selectedAndelIndex, setSelectedAndelIndex] = React.useState('0');
  const utbetalingsgradFraUttak = desimalerTilProsent(selectedItemData.totalUtbetalingsgradFraUttak);
  const utbetalingsgradEtterReduksjonVedTilkommetInntekt = desimalerTilProsent(
    selectedItemData.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt,
  );

  useEffect(() => {
    setSelectedAndelIndex('0');
  }, [selectedItemData.fom]);

  const harUtbetalingsgradFraUttak =
    !!selectedItemData.totalUtbetalingsgradFraUttak || selectedItemData.totalUtbetalingsgradFraUttak === 0;
  const harTilkommetAktivitet =
    !!selectedItemData.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt ||
    selectedItemData.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt === 0;
  const utbetalingsgradVedTilkommetInntektErMinst = () => {
    if (harTilkommetAktivitet) {
      return (
        selectedItemData.totalUtbetalingsgradFraUttak >
        selectedItemData.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt
      );
    }
    return false;
  };

  const numberOfDaysAndWeeks = calcDaysAndWeeksWithWeekends(selectedItemStartDate, selectedItemEndDate);
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <TimeLineDataContainer>
      <HGrid gap="1" columns={{ xs: '10fr 2fr' }}>
        <div>
          <Label size="small" as="p">
            Detaljer for valgt periode
          </Label>
        </div>
        <div>
          <FloatRight>
            <TimeLineButton text="Forrige periode" type="prev" callback={callbackBackward} />
            <TimeLineButton text="Neste periode" type="next" callback={callbackForward} />
          </FloatRight>
        </div>
      </HGrid>
      <VerticalSpacer eightPx />

      <div className={styles.detailsPeriode}>
        <div className="flex gap-2">
          <BodyShort size="small" className="font-semibold">
            {`${moment(selectedItemStartDate).format(DDMMYYYY_DATE_FORMAT).toString()} - ${moment(selectedItemEndDate).format(DDMMYYYY_DATE_FORMAT).toString()}`}
          </BodyShort>
          <BodyShort size="small">
            (
            <FormattedMessage
              id={numberOfDaysAndWeeks.id}
              values={{
                weeks: numberOfDaysAndWeeks.weeks.toString(),
                days: numberOfDaysAndWeeks.days.toString(),
              }}
            />
            )
          </BodyShort>
        </div>
        {harUtbetalingsgradFraUttak && (
          <div>
            <div className="mt-6">
              <BodyShort size="small">
                {`Total utbetalingsgrad av beregningsgrunnlag: `}
                <span className="font-semibold inline-block">
                  {utbetalingsgradVedTilkommetInntektErMinst()
                    ? utbetalingsgradEtterReduksjonVedTilkommetInntekt
                    : utbetalingsgradFraUttak}
                  %
                </span>
              </BodyShort>
            </div>
            {harTilkommetAktivitet && (
              <UtbetalingsgradDetaljer
                utbetalingsgradVedTilkommetInntektErMinst={utbetalingsgradVedTilkommetInntektErMinst()}
                utbetalingsgradFraUttak={utbetalingsgradFraUttak}
                utbetalingsgradEtterReduksjonVedTilkommetInntekt={utbetalingsgradEtterReduksjonVedTilkommetInntekt}
              />
            )}
          </div>
        )}
        <div className="mt-5 mb-4">
          <BodyShort size="small">
            {`Utbetalt dagsats: `}
            <span className="font-semibold inline-block">{selectedItemData.dagsats} kr</span>
          </BodyShort>
        </div>
        {(andeler || []).length > 1 &&
          andeler.map((andel, index) => (
            <div key={`index${index + 1}`} className="flex flex-col gap-3">
              {!!andel.refusjon && (
                <div className="flex justify-between items-start">
                  <BodyShort size="small" className="inline-block">
                    {`${createVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId)}: ${Number(andel.refusjon)} kr`}
                  </BodyShort>
                  <Tag size="xsmall" variant="neutral-moderate" className={styles.tilkjentYtelseTag}>
                    Refusjon
                  </Tag>
                </div>
              )}
              {!!andel.tilSoker && (
                <div className="flex justify-between items-start">
                  <BodyShort size="small" className="inline-block">
                    {`${createVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId)}: ${Number(andel.tilSoker)} kr`}
                  </BodyShort>
                  <Tag size="xsmall" variant="neutral-moderate" className={styles.tilkjentYtelseTag}>
                    Til bruker
                  </Tag>
                </div>
              )}
            </div>
          ))}
      </div>
      <Tabs className="mt-12" value={String(selectedAndelIndex)} onChange={setSelectedAndelIndex}>
        <Tabs.List>
          {andeler.map((andel, index) => {
            const label = createVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId);
            return <Tabs.Tab value={String(index)} key={label} label={label} />;
          })}
        </Tabs.List>
        {andeler.map((andel, index) => (
          <Tabs.Panel
            key={createVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId)}
            value={String(index)}
          >
            <div className="p-4">
              <BodyShort size="small">
                {`Utbetalt refusjon: `}
                <span className="font-semibold inline-block">{andel?.refusjon} kr</span>
              </BodyShort>
              <BodyShort size="small">
                {`Utbetalt til søker: `}
                <span className="font-semibold inline-block">{andel?.tilSoker} kr</span>
              </BodyShort>
              <BodyShort size="small">
                {`Utbetalingsgrad: `}
                <span className="font-semibold inline-block">{andel?.utbetalingsgrad} %</span>
              </BodyShort>
              <BodyShort size="small">
                {`Aktivitetsstatus: `}
                <span className="font-semibold inline-block">
                  {getAktivitet(andel?.aktivitetStatus, getKodeverknavn)}
                </span>
              </BodyShort>
            </div>
          </Tabs.Panel>
        ))}
      </Tabs>
    </TimeLineDataContainer>
  );
};

export default TilkjentYtelseTimeLineData;
