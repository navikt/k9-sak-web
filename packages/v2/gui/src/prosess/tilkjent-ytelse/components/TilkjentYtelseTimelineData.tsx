import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { calcDaysAndWeeksWithWeekends } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HGrid, HStack, Label, Tabs, Tag } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import type { ArbeidsgiverOpplysningerPerId } from '../types/arbeidsgiverOpplysningerType';
import { createArbeidsgiverVisningsnavnForAndel, getAktivitet } from './TilkjentYteleseUtils';
import type { PeriodeMedId } from './TilkjentYtelse';
import styles from './tilkjentYtelse.module.css';
import UtbetalingsgradDetaljer from './UtbetalingsgradDetaljer';

interface OwnProps {
  selectedItemStartDate: string;
  selectedItemEndDate: string;
  selectedItemData?: PeriodeMedId;
  callbackForward: (...args: any[]) => any;
  callbackBackward: (...args: any[]) => any;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  showAndelDetails?: boolean;
}

/**
 * TimeLineData
 *
 * Viser opp data fra valgt periode i tilkjent ytelse-tidslinjen
 */

const desimalerTilProsent = (value: number | null | undefined) => {
  if (!value && value !== 0) {
    return '';
  }
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
  arbeidsgiverOpplysningerPerId,
  showAndelDetails = true,
}: OwnProps) => {
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const andeler = selectedItemData?.andeler || [];
  const [selectedAndelIndex, setSelectedAndelIndex] = React.useState('0');
  const utbetalingsgradFraUttak = desimalerTilProsent(selectedItemData?.totalUtbetalingsgradFraUttak);
  const utbetalingsgradEtterReduksjonVedTilkommetInntekt = desimalerTilProsent(
    selectedItemData?.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt,
  );

  useEffect(() => {
    setSelectedAndelIndex('0');
  }, [selectedItemData?.fom]);

  const harUtbetalingsgradFraUttak =
    !!selectedItemData?.totalUtbetalingsgradFraUttak || selectedItemData?.totalUtbetalingsgradFraUttak === 0;
  const harTilkommetAktivitet =
    !!selectedItemData?.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt ||
    selectedItemData?.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt === 0;
  const utbetalingsgradVedTilkommetInntektErMinst = () => {
    if (
      harTilkommetAktivitet &&
      selectedItemData?.totalUtbetalingsgradFraUttak &&
      selectedItemData?.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt
    ) {
      return (
        selectedItemData.totalUtbetalingsgradFraUttak >
        selectedItemData.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt
      );
    }
    return false;
  };

  const numberOfDaysAndWeeks = calcDaysAndWeeksWithWeekends(selectedItemStartDate, selectedItemEndDate);
  return (
    <HGrid gap="space-4" columns={{ xs: '12fr' }}>
      <div className={styles['showDataContainer']}>
        <HGrid gap="space-4" columns={{ xs: '10fr 2fr' }}>
          <div>
            <Label size="small" as="p">
              Detaljer for valgt periode
            </Label>
          </div>
          <div>
            <HStack gap="space-4" className="float-right">
              <Button
                variant="secondary"
                size="xsmall"
                type="button"
                icon={<ChevronLeftIcon title="Forrige periode" fontSize="1.5rem" />}
                onClick={callbackBackward}
              />
              <Button
                variant="secondary"
                size="xsmall"
                type="button"
                icon={<ChevronRightIcon title="Neste periode" fontSize="1.5rem" />}
                onClick={callbackForward}
              />
            </HStack>
          </div>
        </HGrid>
        <div className="mt-2" />

        <div className={styles['detailsPeriode']}>
          <div className="flex gap-2">
            <BodyShort size="small" className="font-semibold">
              {`${initializeDate(selectedItemStartDate).format(DDMMYYYY_DATE_FORMAT).toString()} - ${initializeDate(selectedItemEndDate).format(DDMMYYYY_DATE_FORMAT).toString()}`}
            </BodyShort>
            <BodyShort size="small">{numberOfDaysAndWeeks}</BodyShort>
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
              <span className="font-semibold inline-block">{selectedItemData?.dagsats} kr</span>
            </BodyShort>
          </div>
          {(andeler || []).length > 1 &&
            andeler.map((andel, index) => (
              <div key={`index${index + 1}`} className="flex flex-col gap-3">
                {!!andel.refusjon && (
                  <div className="flex justify-between items-start">
                    <BodyShort size="small" className="inline-block">
                      {`${createArbeidsgiverVisningsnavnForAndel(andel, kodeverkNavnFraKode, arbeidsgiverOpplysningerPerId)}: ${Number(andel.refusjon)} kr`}
                    </BodyShort>
                    <Tag size="xsmall" variant="neutral-moderate" className={styles['tilkjentYtelseTag']}>
                      Refusjon
                    </Tag>
                  </div>
                )}
                {!!andel.tilSoker && (
                  <div className="flex justify-between items-start">
                    <BodyShort size="small" className="inline-block">
                      {`${createArbeidsgiverVisningsnavnForAndel(andel, kodeverkNavnFraKode, arbeidsgiverOpplysningerPerId)}: ${Number(andel.tilSoker)} kr`}
                    </BodyShort>
                    <Tag size="xsmall" variant="neutral-moderate" className={styles['tilkjentYtelseTag']}>
                      Til bruker
                    </Tag>
                  </div>
                )}
              </div>
            ))}
        </div>
        {showAndelDetails && (
          <Tabs className="mt-12" value={String(selectedAndelIndex)} onChange={setSelectedAndelIndex}>
            <Tabs.List>
              {andeler.map((andel, index) => {
                const label = createArbeidsgiverVisningsnavnForAndel(
                  andel,
                  kodeverkNavnFraKode,
                  arbeidsgiverOpplysningerPerId,
                );
                return <Tabs.Tab value={String(index)} key={label} label={label} />;
              })}
            </Tabs.List>
            {andeler.map((andel, index) => (
              <Tabs.Panel
                key={createArbeidsgiverVisningsnavnForAndel(andel, kodeverkNavnFraKode, arbeidsgiverOpplysningerPerId)}
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
                      {getAktivitet(andel?.aktivitetStatus, kodeverkNavnFraKode)}
                    </span>
                  </BodyShort>
                </div>
              </Tabs.Panel>
            ))}
          </Tabs>
        )}
      </div>
    </HGrid>
  );
};

export default TilkjentYtelseTimeLineData;
