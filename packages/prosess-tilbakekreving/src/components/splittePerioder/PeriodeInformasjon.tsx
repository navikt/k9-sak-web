import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { calcDaysAndWeeks, DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr } from '@fpsak-frontend/utils';

import DataForPeriode from '../../types/dataForPeriodeTsType';

import styles from './periodeInformasjon.module.css';

interface OwnProps {
  fom: string;
  tom: string;
  feilutbetaling: number;
  arsak?: DataForPeriode['årsak'];
}

/**
 * PeriodeInformasjon
 *
 * Tilbakekreving periode oppsummering
 *
 * Presentationskomponent
 */
const PeriodeInformasjon = ({ fom, tom, feilutbetaling, arsak }: OwnProps) => {
  const daysAndWeeks = calcDaysAndWeeks(fom, tom);
  return (
    <Row>
      <Column md="8">
        <div className={styles.infoSummary}>
          <Row>
            <Column xs="6">
              <Element>
                {`${moment(fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(tom).format(DDMMYYYY_DATE_FORMAT)}`}
              </Element>
            </Column>
            <Column xs="6">
              <Normaltekst>
                <FormattedMessage
                  id={daysAndWeeks.id}
                  values={{
                    weeks: daysAndWeeks.weeks,
                    days: daysAndWeeks.days,
                  }}
                />
              </Normaltekst>
            </Column>
          </Row>
          <div className={styles.resultSum}>
            <Row className={styles.redNumbers}>
              <Column xs="6">
                <Normaltekst className={styles.resultName}>
                  <FormattedMessage id="PeriodeInformasjon.Feilutbetaling" />:
                  <span className={feilutbetaling ? styles.redNumber : styles.positivNumber}>
                    {formatCurrencyNoKr(feilutbetaling)}
                  </span>
                </Normaltekst>
              </Column>
              <Column xs="6">
                {arsak && <Normaltekst className={styles.resultName}>{arsak.hendelseType.navn}</Normaltekst>}
              </Column>
            </Row>
          </div>
        </div>
      </Column>
    </Row>
  );
};

export default PeriodeInformasjon;
