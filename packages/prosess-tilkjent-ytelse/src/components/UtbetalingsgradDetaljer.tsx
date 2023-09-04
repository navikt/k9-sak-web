import React from 'react';
import { BodyShort, ReadMore } from '@navikt/ds-react';
import { CheckmarkIcon } from '@navikt/aksel-icons';

interface OwnProps {
  utbetalingsgradVedTilkommetInntektErMinst: boolean;
  utbetalingsgradFraUttak: string;
  utbetalingsgradEtterReduksjonVedTilkommetInntekt: string;
}

const UtbetalingsgradDetaljer = ({
  utbetalingsgradVedTilkommetInntektErMinst,
  utbetalingsgradFraUttak,
  utbetalingsgradEtterReduksjonVedTilkommetInntekt,
}: OwnProps) => (
  <ReadMore size="small" header="Detaljer om utbetalingsgrad" className="mt-1">
    <ul>
      <li>
        <div className={!utbetalingsgradVedTilkommetInntektErMinst ? 'font-semibold flex items-center' : ''}>
          {`Resultat fra uttak: ${utbetalingsgradFraUttak}%`}
          {!utbetalingsgradVedTilkommetInntektErMinst && (
            <CheckmarkIcon fontSize="1.5rem" className="text-icon-success" />
          )}
        </div>
      </li>
      <li>
        <div className={utbetalingsgradVedTilkommetInntektErMinst ? 'font-semibold flex items-center' : ''}>
          {`Resultat grunnet ny inntekt: ${utbetalingsgradEtterReduksjonVedTilkommetInntekt}%`}
          {utbetalingsgradVedTilkommetInntektErMinst && (
            <CheckmarkIcon fontSize="1.5rem" className="text-icon-success" />
          )}
        </div>
      </li>
    </ul>

    <div className="mt-8">
      {!utbetalingsgradVedTilkommetInntektErMinst && (
        <BodyShort size="small">
          Den laveste graden styrer utbetalingsgraden. Når resultat i uttak er lavere enn resultat grunnet ny inntekt,
          vil ny inntekt ikke gi reduksjon i utbetaling.
        </BodyShort>
      )}
      {utbetalingsgradVedTilkommetInntektErMinst && (
        <BodyShort size="small">
          Den laveste graden styrer utbetalingsgraden. Utbetalingen reduseres på grunn av inntekt i ny aktivitet.
        </BodyShort>
      )}
    </div>
  </ReadMore>
);

export default UtbetalingsgradDetaljer;
