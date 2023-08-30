import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import { BodyShort, Tabs, Tag } from '@navikt/ds-react';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { VerticalSpacer, FloatRight } from '@fpsak-frontend/shared-components';
import { calcDaysAndWeeksWithWeekends, DDMMYYYY_DATE_FORMAT, getKodeverknavnFn } from '@fpsak-frontend/utils';
import { TimeLineButton, TimeLineDataContainer } from '@fpsak-frontend/tidslinje';
import { KodeverkMedNavn, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

import { createVisningsnavnForAndel, getAktivitet } from './TilkjentYteleseUtils';
import { PeriodeMedId } from './TilkjentYtelse';
import styles from './tilkjentYtelse.less';
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
  const utbetalingsgradFraUttak = desimalerTilProsent(selectedItemData.totalUtbetalingsgradFraUttak);
  const utbetalingsgradEtterReduksjonVedTilkommetInntekt = desimalerTilProsent(
    selectedItemData.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt,
  );
  const harUtbetalingsgradFraUttak = !!selectedItemData.totalUtbetalingsgradFraUttak;
  const harTilkommetAktivitet = !!selectedItemData.totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt;

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
  const intl = useIntl();
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <TimeLineDataContainer>
      <Row>
        <Column xs="10">
          <Element>
            <FormattedMessage id="TilkjentYtelse.PeriodeData.Detaljer" />
          </Element>
        </Column>
        <Column xs="2">
          <FloatRight>
            <TimeLineButton
              text={intl.formatMessage({ id: 'Timeline.prevPeriod' })}
              type="prev"
              callback={callbackBackward}
            />
            <TimeLineButton
              text={intl.formatMessage({ id: 'Timeline.nextPeriod' })}
              type="next"
              callback={callbackForward}
            />
          </FloatRight>
        </Column>
      </Row>
      <VerticalSpacer eightPx />

      <div className={styles.detailsPeriode}>
        <div className="flex gap-2">
          <BodyShort size="small" className="font-semibold">
            <FormattedMessage
              id="TilkjentYtelse.PeriodeData.Periode"
              values={{
                fomVerdi: moment(selectedItemStartDate).format(DDMMYYYY_DATE_FORMAT).toString(),
                tomVerdi: moment(selectedItemEndDate).format(DDMMYYYY_DATE_FORMAT).toString(),
              }}
            />
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
                <FormattedMessage id="TilkjentYtelse.PeriodeData.UtbetalingsgradAvBeregningsGrunnlag" />
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
            <FormattedMessage id="TilkjentYtelse.PeriodeData.Dagsats" />
            <span className="font-semibold inline-block">{selectedItemData.dagsats} kr</span>
          </BodyShort>
        </div>
        {(andeler || []).length > 1 &&
          andeler.map((andel, index) => (
            <div key={`index${index + 1}`} className="mt-2">
              {!!andel.refusjon && (
                <div className="flex gap-2">
                  <BodyShort size="small" className="inline-block">
                    <FormattedMessage
                      id="Timeline.tooltip.dagsatsPerAndel"
                      key={`index${index + 1}`}
                      values={{
                        arbeidsgiver: createVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId),
                        dagsatsPerAndel: Number(andel.refusjon),
                      }}
                    />
                  </BodyShort>
                  <Tag size="xsmall" variant="neutral-moderate" className="tilkjentYtelseTag">
                    Refusjon
                  </Tag>
                </div>
              )}
              {!!andel.tilSoker && (
                <div className="flex gap-2">
                  <BodyShort size="small" className="inline-block">
                    <FormattedMessage
                      id="Timeline.tooltip.dagsatsPerAndel"
                      key={`index${index + 1}`}
                      values={{
                        arbeidsgiver: createVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId),
                        dagsatsPerAndel: Number(andel.tilSoker),
                      }}
                    />
                  </BodyShort>
                  <Tag size="xsmall" variant="neutral-moderate" className="tilkjentYtelseTag">
                    Til bruker
                  </Tag>
                </div>
              )}
            </div>
          ))}
      </div>
      <Tabs
        className="mt-12"
        defaultValue={
          andeler.length
            ? createVisningsnavnForAndel(andeler[0], getKodeverknavn, arbeidsgiverOpplysningerPerId)
            : undefined
        }
      >
        <Tabs.List>
          {andeler.map(andel => {
            const label = createVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId);
            return <Tabs.Tab value={label} key={label} label={label} />;
          })}
        </Tabs.List>
        {andeler.map(andel => (
          <Tabs.Panel
            key={createVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId)}
            value={createVisningsnavnForAndel(andel, getKodeverknavn, arbeidsgiverOpplysningerPerId)}
          >
            <div className="p-4">
              <BodyShort size="small">
                <FormattedMessage id="TilkjentYtelse.PeriodeData.UtbetaltRefusjon" />
                <span className="font-semibold inline-block">{andel?.refusjon} kr</span>
              </BodyShort>
              <BodyShort size="small">
                <FormattedMessage id="TilkjentYtelse.PeriodeData.UtbetaltTilSoker" />
                <span className="font-semibold inline-block">{andel?.tilSoker} kr</span>
              </BodyShort>
              <BodyShort size="small">
                <FormattedMessage id="TilkjentYtelse.PeriodeData.Utbetalingsgrad" />
                <span className="font-semibold inline-block">{andel?.utbetalingsgrad} %</span>
              </BodyShort>
              <BodyShort size="small">
                <FormattedMessage id="TilkjentYtelse.PeriodeData.Aktivitetsstatus" />
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
