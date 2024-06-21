import { DDMMYYYY_DATE_FORMAT, calcDaysAndWeeks, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { BodyShort, HGrid, Label } from '@navikt/ds-react';
import moment from 'moment';
import React from 'react';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { FormattedMessage } from 'react-intl';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
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
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const daysAndWeeks = calcDaysAndWeeks(fom, tom);
  return (
    <HGrid gap="1" columns={{ xs: '8fr 4fr' }}>
      <div>
        <div className={styles.infoSummary}>
          <HGrid gap="4" columns={{ xs: '6fr 6fr' }}>
            <div>
              <Label size="small" as="p">
                {`${moment(fom).format(DDMMYYYY_DATE_FORMAT)} - ${moment(tom).format(DDMMYYYY_DATE_FORMAT)}`}
              </Label>
            </div>
            <div>
              <BodyShort size="small">
                <FormattedMessage
                  id={daysAndWeeks.id}
                  values={{
                    weeks: daysAndWeeks.weeks,
                    days: daysAndWeeks.days,
                  }}
                />
              </BodyShort>
            </div>
          </HGrid>
          <div className={styles.resultSum}>
            <HGrid gap="4" columns={{ xs: '6fr 6fr' }} className={styles.redNumbers}>
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
                    {
                      kodeverkNavnFraKode(
                        arsak.hendelseType,
                        KodeverkType.HENDELSE_TYPE,
                      ) /* Kodeverk: kan være denne skal slå opp i et annet kodeverk, tilbake? */
                    }
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
