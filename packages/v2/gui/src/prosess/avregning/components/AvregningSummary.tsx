import { BodyShort, HGrid, Label } from '@navikt/ds-react';
import { formatPeriod } from '../../../utils/formatters';
import { formatCurrencyWithoutKr } from '@k9-sak-web/gui/utils/formatters.js';
import { isUngWeb } from '../../../utils/urlUtils';
import type { DetaljertSimuleringResultatDto } from '@k9-sak-web/backend/k9oppdrag/kontrakt/simulering/v1/DetaljertSimuleringResultatDto.js';

interface AvregningSummaryProps {
  fom: DetaljertSimuleringResultatDto['periode']['fom'];
  tom: DetaljertSimuleringResultatDto['periode']['tom'];
  feilutbetaling: DetaljertSimuleringResultatDto['sumFeilutbetaling'];
  etterbetaling: DetaljertSimuleringResultatDto['sumEtterbetaling'];
  inntrekk: DetaljertSimuleringResultatDto['sumInntrekk'];
  ingenPerioderMedAvvik: DetaljertSimuleringResultatDto['ingenPerioderMedAvvik'];
}
/**
 * Avregning oppsummering
 *
 * Presentationskomponent
 */

const AvregningSummary = ({
  fom,
  tom,
  feilutbetaling,
  etterbetaling,
  inntrekk = undefined,
  ingenPerioderMedAvvik,
}: AvregningSummaryProps) => {
  const isUngFagsak = isUngWeb();
  return (
    <>
      <BodyShort size="small" className="font-bold">
        Bruker
      </BodyShort>
      <div className="h-auto max-w-[500px] bg-[#f1f1f1] py-2.5 px-5 top-0">
        {ingenPerioderMedAvvik && <div className="font-bold">Ingen periode med avvik</div>}
        {!ingenPerioderMedAvvik && (
          <>
            <Label size="small" as="p">
              {formatPeriod(fom, tom)}
            </Label>
            <div className="mt-4">
              <HGrid gap="space-4" columns={{ xs: '3fr 2fr 7fr' }}>
                <BodyShort size="small" className="w-[150px]">
                  Etterbetaling:
                </BodyShort>
                <BodyShort size="small">
                  <span className="float-left font-bold">{formatCurrencyWithoutKr(etterbetaling)}</span>
                </BodyShort>
              </HGrid>
              <HGrid gap="space-4" columns={{ xs: inntrekk !== null ? '3fr 2fr 4fr 3fr' : '3fr 2fr 7fr' }}>
                <div>
                  <BodyShort size="small" className="w-[150px]">
                    Feilutbetaling:
                  </BodyShort>
                </div>
                <BodyShort
                  size="small"
                  className={feilutbetaling ? 'font-bold text-[var(--ax-text-logo)]' : 'font-bold'}
                >
                  {formatCurrencyWithoutKr(feilutbetaling)}
                </BodyShort>
                {inntrekk !== null && !isUngFagsak && (
                  <BodyShort size="small">
                    Inntrekk:
                    <span className={inntrekk ? 'font-bold pl-4 text-[var(--ax-text-logo)]' : 'font-bold pl-4'}>
                      {formatCurrencyWithoutKr(inntrekk)}
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
};

export default AvregningSummary;
