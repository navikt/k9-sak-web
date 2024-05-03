import { DDMMYYYY_DATE_FORMAT, calcDaysAndWeeks, formatCurrencyNoKr } from '@k9-sak-web/utils';
import { BodyShort, HGrid, Label } from '@navikt/ds-react';
import moment from 'moment';
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
    <HGrid gap="1" columns={{ xs: '8fr 4fr' }}>
      <div className={styles.infoSummary}>
        <HGrid gap="1" columns={{ xs: '6fr 6fr' }}>
          <Label size="small" as="p">
            {`${moment(fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(tom).format(DDMMYYYY_DATE_FORMAT)}`}
          </Label>
          <BodyShort size="small">
            <FormattedMessage
              id={daysAndWeeks.id}
              values={{
                weeks: daysAndWeeks.weeks,
                days: daysAndWeeks.days,
              }}
            />
          </BodyShort>
        </HGrid>
        <div className={styles.resultSum}>
          <HGrid gap="1" columns={{ xs: '6fr 6fr' }} className={styles.redNumbers}>
            <BodyShort size="small" className={styles.resultName}>
              <FormattedMessage id="PeriodeInformasjon.Feilutbetaling" />:
              <span className={feilutbetaling ? styles.redNumber : styles.positivNumber}>
                {formatCurrencyNoKr(feilutbetaling)}
              </span>
            </BodyShort>
            <div>
              {arsak && (
                <BodyShort size="small" className={styles.resultName}>
                  {arsak.årsak}
                </BodyShort>
              )}
            </div>
          </HGrid>
        </div>
      </div>
    </HGrid>
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
