import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { BodyShort, HGrid, Label } from '@navikt/ds-react';
import { FormattedMessage } from 'react-intl';
import DataForPeriode from '../../types/dataForPeriodeTsType';

import { calcDaysAndWeeks } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
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
    <HGrid gap="space-4" columns={{ xs: '8fr 4fr' }}>
      <div>
        <div className={styles.infoSummary}>
          <HGrid gap="space-16" columns={{ xs: '6fr 6fr' }}>
            <div>
              <Label size="small" as="p">
                {`${initializeDate(fom).format(DDMMYYYY_DATE_FORMAT)} - ${initializeDate(tom).format(DDMMYYYY_DATE_FORMAT)}`}
              </Label>
            </div>
            <div>
              <BodyShort size="small">{daysAndWeeks}</BodyShort>
            </div>
          </HGrid>
          <div className={styles.resultSum}>
            <HGrid gap="space-16" columns={{ xs: '6fr 6fr' }} className={styles.redNumbers}>
              <div>
                <BodyShort size="small" className={styles.resultName}>
                  <FormattedMessage id="PeriodeInformasjon.Feilutbetaling" />:
                  <span className={feilutbetaling ? styles.redNumber : styles.positivNumber}>
                    {formatCurrencyNoKr(feilutbetaling)}
                  </span>
                </BodyShort>
              </div>
              <div>
                {arsak && (
                  <BodyShort size="small" className={styles.resultName}>
                    {arsak.hendelseType.navn}
                  </BodyShort>
                )}
              </div>
            </HGrid>
          </div>
        </div>
      </div>
    </HGrid>
  );
};

export default PeriodeInformasjon;
