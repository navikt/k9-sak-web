import { DDMMYYYY_DATE_FORMAT, calcDaysAndWeeks, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { BodyShort, Label } from '@navikt/ds-react';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './periodeInformasjon.module.css';

/**
 * PeriodeInformasjon
 *
 * Tilbakekreving periode oppsummering
 *
 * Presentationskomponent
 */
const PeriodeInformasjon = ({ fom, tom, feilutbetaling, arsak }) => {
  const daysAndWeeks = calcDaysAndWeeks(moment(fom.toString()), moment(tom.toString()));
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
                    {arsak.årsak}
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

PeriodeInformasjon.propTypes = {
  fom: PropTypes.string.isRequired,
  tom: PropTypes.string.isRequired,
  feilutbetaling: PropTypes.number.isRequired,
  arsak: PropTypes.shape({
    årsak: PropTypes.string.isRequired,
  }),
};

PeriodeInformasjon.defaultProsp = {
  arsak: undefined,
};

export default PeriodeInformasjon;
