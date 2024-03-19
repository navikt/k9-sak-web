import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { BodyShort, Label } from '@navikt/ds-react';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './avregningSummary.module.css';

/**
 * Avregning oppsummering
 *
 * Presentationskomponent
 */
const AvregningSummary = ({ fom, tom, feilutbetaling, etterbetaling, inntrekk, ingenPerioderMedAvvik }) => (
  <>
    <BodyShort size="small" className={styles.summaryTitle}>
      <FormattedMessage id="Avregning.bruker" />
    </BodyShort>
    <VerticalSpacer eightPx />
    <div className={styles.infoSummary}>
      {ingenPerioderMedAvvik && (
        <div className={styles.ingenPerioder}>
          <FormattedMessage id="Avregning.ingenPerioder" />
        </div>
      )}
      {!ingenPerioderMedAvvik && (
        <>
          <Row>
            <Column xs="12">
              <Label size="small" as="p">
                {`${moment(fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(tom).format(DDMMYYYY_DATE_FORMAT)}`}
              </Label>
            </Column>
          </Row>
          <div className={styles.resultSum}>
            <Row>
              <Column xs="3">
                <BodyShort size="small" className={styles.resultName}>
                  <FormattedMessage id="Avregning.etterbetaling" />:
                </BodyShort>
              </Column>
              <Column xs="2">
                <span className={styles.number}>{formatCurrencyNoKr(etterbetaling)}</span>
              </Column>
            </Row>
            <Row className={styles.redNumbers}>
              <Column xs="3">
                <BodyShort size="small" className={styles.resultName}>
                  <FormattedMessage id="Avregning.tilbakekreving" />:
                </BodyShort>
              </Column>
              <Column xs="2">
                <span className={feilutbetaling ? styles.redNumber : styles.positivNumber}>
                  {formatCurrencyNoKr(feilutbetaling)}
                </span>
              </Column>
              {inntrekk !== null && (
                <Column xs="4">
                  <BodyShort size="small">
                    <FormattedMessage id="Avregning.inntrekk" />:
                    <span className={inntrekk ? styles.lastNumberRed : styles.lastNumberPositiv}>
                      {formatCurrencyNoKr(inntrekk)}
                    </span>
                  </BodyShort>
                </Column>
              )}
            </Row>
          </div>
        </>
      )}
    </div>
  </>
);

AvregningSummary.propTypes = {
  fom: PropTypes.string.isRequired,
  tom: PropTypes.string.isRequired,
  feilutbetaling: PropTypes.number.isRequired,
  etterbetaling: PropTypes.number.isRequired,
  inntrekk: PropTypes.number,
  ingenPerioderMedAvvik: PropTypes.bool.isRequired,
};

AvregningSummary.defaultProps = {
  inntrekk: null,
};

export default AvregningSummary;
