import { BodyShort, HGrid, Label } from '@navikt/ds-react';
import { formatPeriod } from '../../../utils/formatters';
import { formatCurrencyWithoutKr } from '@k9-sak-web/gui/utils/formatters.js';

interface AvregningSummaryProps {
  fom: string;
  tom: string;
  feilutbetaling: number;
  etterbetaling: number;
  inntrekk: number | null;
  ingenPerioderMedAvvik: boolean;
  isUngFagsak: boolean;
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
  inntrekk = null,
  ingenPerioderMedAvvik,
  isUngFagsak,
}: AvregningSummaryProps) => (
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
              <BodyShort size="small" className={feilutbetaling ? 'font-bold text-[var(--ax-text-logo)]' : 'font-bold'}>
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

export default AvregningSummary;
