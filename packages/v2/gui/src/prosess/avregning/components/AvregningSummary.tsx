import { DDMMYYYY_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { BodyShort, HGrid, Label, VStack } from '@navikt/ds-react';
import { formatCurrencyNoKr } from '@navikt/ft-utils';
import styles from './avregningSummary.module.css';

interface OwnProps {
  fom: string;
  tom: string;
  feilutbetaling: number | undefined;
  etterbetaling: number | undefined;
  inntrekk: number | undefined;
  ingenPerioderMedAvvik: boolean;
  isUngFagsak: boolean;
}

export const AvregningSummary = ({
  fom,
  tom,
  feilutbetaling,
  etterbetaling,
  inntrekk,
  ingenPerioderMedAvvik,
  isUngFagsak,
}: OwnProps) => (
  <VStack gap="space-8">
    <BodyShort size="small" className={styles.summaryTitle}>
      Bruker
    </BodyShort>
    <div className={styles.infoSummary}>
      {ingenPerioderMedAvvik && <div className={styles.ingenPerioder}>Ingen periode med avvik</div>}
      {!ingenPerioderMedAvvik && (
        <>
          <Label size="small" as="p">
            {`${initializeDate(fom).format(DDMMYYYY_DATE_FORMAT)} - ${initializeDate(tom).format(DDMMYYYY_DATE_FORMAT)}`}
          </Label>
          <div className={styles.resultSum}>
            <HGrid gap="space-4" columns={{ xs: '3fr 2fr 7fr' }}>
              <BodyShort size="small" className={styles.resultName}>
                Etterbetaling:
              </BodyShort>
              <BodyShort size="small">
                <span className={styles.number}>{formatCurrencyNoKr(etterbetaling)}</span>
              </BodyShort>
            </HGrid>
            <HGrid
              gap="space-4"
              columns={{ xs: inntrekk !== null ? '3fr 2fr 4fr 3fr' : '3fr 2fr 7fr' }}
              className={styles.redNumbers}
            >
              <div>
                <BodyShort size="small" className={styles.resultName}>
                  Feilutbetaling:
                </BodyShort>
              </div>
              <BodyShort size="small" className={feilutbetaling ? styles.redNumber : styles.positivNumber}>
                {formatCurrencyNoKr(feilutbetaling)}
              </BodyShort>
              {inntrekk !== null && !isUngFagsak && (
                <BodyShort size="small">
                  Inntrekk:
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
  </VStack>
);
