import type { ExtendedApiError } from '@k9-sak-web/backend/shared/instrumentation/ExtendedApiError.js';
import { ExtendedApiErrorAlert } from './ExtendedApiErrorAlert.js';
import { VStack } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';

export interface TopplinjeAlertsProps {
  readonly apiErrors: ExtendedApiError[];
  readonly onApiErrorDismiss: (error: ExtendedApiError) => void;
}

/**
 * Viser ellers uhandterte feil eller andre viktige notifikasjoner under Dekorator panelet på toppen av skjermbildet.
 *
 * I første omgang kun for visning av ExtendedApiError type, tenkt å kunne utvidast med andre feiltyper etterkvart.
 *
 * Det er forventa at komponent lenger oppe i hierarkiet handterer state oppdatering slik at feilmelding forsvinner når
 * bruker krysser den ut.
 */
export const TopplinjeAlerts = ({ apiErrors, onApiErrorDismiss }: TopplinjeAlertsProps) => {
  const prevApiErrors = useRef<ExtendedApiError[]>(apiErrors);
  useEffect(() => {
    if (apiErrors.length > prevApiErrors.current.length) {
      // Feil har blitt lagt til. Scroll til toppen av sida så brukar ser feilmeldinga.
      // Kunne brukt scrollIntoView på elementet her, men pga at dekorator ligg utanpå DOM layout øverst vart det
      // delvis skjult då. Vurder å fikse det seinare.
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    prevApiErrors.current = apiErrors;
  }, [apiErrors]);
  if (apiErrors.length > 0) {
    const apiErrorAlerts = apiErrors.map(err => (
      <ExtendedApiErrorAlert error={err} onClose={() => onApiErrorDismiss(err)} key={`apiErr-${err.randomId}`} />
    ));
    return (
      <VStack gap="4" padding="8">
        {apiErrorAlerts}
      </VStack>
    );
  }
  return null;
};
