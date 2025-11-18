import { VStack } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';
import type { ErrorWithAlertInfo } from './AlertInfo.ts';
import { ErrorAlert } from './ErrorAlert.js';

export interface TopplinjeAlertsProps {
  readonly errors: ErrorWithAlertInfo[];
  readonly onErrorDismiss: (error: ErrorWithAlertInfo) => void;
}

/**
 * Viser ellers uhandterte feil eller andre viktige notifikasjoner under Dekorator panelet på toppen av skjermbildet.
 *
 * I første omgang kun for visning av ExtendedApiError type, tenkt å kunne utvidast med andre feiltyper etterkvart.
 *
 * Det er forventa at komponent lenger oppe i hierarkiet handterer state oppdatering slik at feilmelding forsvinner når
 * bruker krysser den ut.
 */
export const TopplinjeAlerts = ({ errors, onErrorDismiss }: TopplinjeAlertsProps) => {
  const prevErrors = useRef<ErrorWithAlertInfo[]>(errors);
  useEffect(() => {
    if (errors.length > prevErrors.current.length) {
      // Feil har blitt lagt til. Scroll til toppen av sida så brukar ser feilmeldinga.
      // Kunne brukt scrollIntoView på elementet her, men pga at dekorator ligg utanpå DOM layout øverst vart det
      // delvis skjult då. Vurder å fikse det seinare.
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    prevErrors.current = errors;
  }, [errors]);
  if (errors.length > 0) {
    const errorAlerts = errors.map(err => (
      <ErrorAlert error={err} onClose={() => onErrorDismiss(err)} key={`err-${err.errorId}`} />
    ));
    return (
      <VStack gap="space-16" padding="8">
        {errorAlerts}
      </VStack>
    );
  }
  return null;
};
