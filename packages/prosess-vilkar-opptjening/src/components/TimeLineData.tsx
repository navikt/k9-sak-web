import React from 'react';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage, useIntl } from 'react-intl';
import { Image } from '@fpsak-frontend/shared-components';
import checkImg from '@fpsak-frontend/assets/images/check.svg';
import advarselImg from '@fpsak-frontend/assets/images/remove.svg';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import opptjeningAktivitetKlassifisering from '@fpsak-frontend/prosess-vilkar-opptjening/src/kodeverk/opptjeningAktivitetKlassifisering';
import { FastsattOpptjeningAktivitet, Kodeverk } from '@k9-sak-web/types';
import { TimeLineButton } from '@fpsak-frontend/tidslinje';

import styles from './timeLineData.less';

const MELLOMLIGGENDE_PERIODE = 'MELLOMLIGGENDE_PERIODE';

const isoToDdMmYyyy = (dato: string): string => {
  const parsedDate = moment(dato, ISO_DATE_FORMAT, true);
  return parsedDate.isValid() ? parsedDate.format(DDMMYYYY_DATE_FORMAT) : dato;
};

const backgroundStyle = (kode: string): string =>
  kode === MELLOMLIGGENDE_PERIODE ||
  kode === opptjeningAktivitetKlassifisering.ANTATT_GODKJENT ||
  kode === opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT
    ? 'godkjent'
    : 'avvist';

const periodStatus = (periodState: string): string =>
  periodState === opptjeningAktivitetKlassifisering.BEKREFTET_AVVIST ||
  periodState === opptjeningAktivitetKlassifisering.ANTATT_AVVIST
    ? 'OpptjeningVilkarView.Avslatt'
    : 'OpptjeningVilkarView.Godkjent';

const isPeriodGodkjent = (period: Kodeverk): boolean =>
  !!(
    period.kode === opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT ||
    period.kode === opptjeningAktivitetKlassifisering.ANTATT_GODKJENT ||
    period.kode === MELLOMLIGGENDE_PERIODE
  );

interface OwnProps {
  fastsattOpptjeningAktivitet: FastsattOpptjeningAktivitet;
  selectNextPeriod: (event: React.MouseEvent) => void;
  selectPrevPeriod: (event: React.MouseEvent) => void;
}

const TimeLineData = ({ fastsattOpptjeningAktivitet, selectNextPeriod, selectPrevPeriod }: OwnProps) => {
  const intl = useIntl();
  return (
    <div>
      <Row>
        <Element>
          <FormattedMessage id="OpptjeningVilkarView.DetailsForSelectedPeriod" />
        </Element>
      </Row>
      <Row>
        <Column xs="6" className={backgroundStyle(fastsattOpptjeningAktivitet.klasse.kode)}>
          <Row className={styles.timeLineDataContainer}>
            <Column xs="6">
              <div>
                <Element>
                  {`${isoToDdMmYyyy(fastsattOpptjeningAktivitet.fom)} - ${isoToDdMmYyyy(
                    fastsattOpptjeningAktivitet.tom,
                  )}`}
                </Element>
              </div>
            </Column>
            <Column xs="6">
              {isPeriodGodkjent(fastsattOpptjeningAktivitet.klasse) && (
                <span className={styles.image}>
                  <Image src={checkImg} className={styles.image} />
                </span>
              )}
              {!isPeriodGodkjent(fastsattOpptjeningAktivitet.klasse) && (
                <span className={styles.image}>
                  <Image src={advarselImg} className={styles.image} />
                </span>
              )}
              <FormattedMessage id={periodStatus(fastsattOpptjeningAktivitet.klasse.kode)} />
            </Column>
          </Row>
        </Column>
        <Column xs="6">
          <TimeLineButton
            text={intl.formatMessage({ id: 'TimeLineData.prevPeriod' })}
            type="prev"
            callback={selectPrevPeriod}
          />
          <TimeLineButton
            text={intl.formatMessage({ id: 'TimeLineData.nextPeriod' })}
            type="next"
            callback={selectNextPeriod}
          />
        </Column>
      </Row>
      <Row />
    </div>
  );
};

export default TimeLineData;
