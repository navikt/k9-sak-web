import { VerticalSpacer } from '@k9-sak-web/shared-components';
import { DDMMYYYY_DATE_FORMAT, formatCurrencyNoKr } from '@k9-sak-web/utils';
import { BodyShort, HGrid, Label } from '@navikt/ds-react';
import moment from 'moment';
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
          <Label size="small" as="p">
            {`${moment(fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(tom).format(DDMMYYYY_DATE_FORMAT)}`}
          </Label>
          <div className={styles.resultSum}>
            <HGrid gap="1" columns={{ xs: '3fr 2fr 7fr' }}>
              <BodyShort size="small" className={styles.resultName}>
                <FormattedMessage id="Avregning.etterbetaling" />:
              </BodyShort>
              <div>
                <span className={styles.number}>{formatCurrencyNoKr(etterbetaling)}</span>
              </div>
            </HGrid>
            <HGrid
              gap="1"
              columns={{ xs: inntrekk !== null ? '3fr 2fr 4fr 3fr' : '3fr 2fr 7fr' }}
              className={styles.redNumbers}
            >
              <div>
                <BodyShort size="small" className={styles.resultName}>
                  <FormattedMessage id="Avregning.tilbakekreving" />:
                </BodyShort>
              </div>
              <span className={feilutbetaling ? styles.redNumber : styles.positivNumber}>
                {formatCurrencyNoKr(feilutbetaling)}
              </span>
              {inntrekk !== null && (
                <BodyShort size="small">
                  <FormattedMessage id="Avregning.inntrekk" />:
                  <span className={inntrekk ? styles.lastNumberRed : styles.lastNumberPositiv}>
                    {formatCurrencyNoKr(inntrekk)}
                  </span>
                </BodyShort>
              )}
            </HGrid>
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
