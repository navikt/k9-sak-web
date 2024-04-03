import { DDMMYYYY_DATE_FORMAT, calcDaysAndWeeks, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { BodyShort, Label } from '@navikt/ds-react';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import React from 'react';
import { FormattedMessage } from 'react-intl';
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
              <Label size="small" as="p">
                {`${moment(fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(tom).format(DDMMYYYY_DATE_FORMAT)}`}
              </Label>
            </Column>
            <Column xs="6">
              <BodyShort size="small">
                <FormattedMessage
                  id={daysAndWeeks.id}
                  values={{
                    weeks: daysAndWeeks.weeks,
                    days: daysAndWeeks.days,
                  }}
                />
              </BodyShort>
            </Column>
          </Row>
          <div className={styles.resultSum}>
            <Row className={styles.redNumbers}>
              <Column xs="6">
                <BodyShort size="small" className={styles.resultName}>
                  <FormattedMessage id="PeriodeInformasjon.Feilutbetaling" />:
                  <span className={feilutbetaling ? styles.redNumber : styles.positivNumber}>
                    {formatCurrencyNoKr(feilutbetaling)}
                  </span>
                </BodyShort>
              </Column>
              <Column xs="6">
                {arsak && (
                  <BodyShort size="small" className={styles.resultName}>
                    {arsak.hendelseType.navn}
                  </BodyShort>
                )}
              </Column>
            </Row>
          </div>
        </div>
      </Column>
    </Row>
  );
};

export default PeriodeInformasjon;
