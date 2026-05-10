import { useCallback } from 'react';
import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';

/**
 * Hook som tilbyr funksjoner for å legge til eller fjerne feil i kontekst.
 * Fungerer kun i komponenter som har en @see RestApiErrorProvider over seg i komponent-treet.
 *
 * Denne sender pr no direkte vidare til showLegacyRestApiError frå GlobalUnhandledErrorCatcher. Beholdt her kun for å
 * sleppe å skrive om alle stader som kaller denne. Kan erstattast med direkte kall til showLegacyRestApiError seinare.
 */
const useRestApiErrorDispatcher = () => {
  const { showLegacyRestApiError } = useGlobalUnhandledErrors();
  const addErrorMessage = useCallback(
    (data: Record<string, unknown>) => {
      showLegacyRestApiError(data);
    },
    [showLegacyRestApiError],
  );
  return {
    addErrorMessage,
  };
};

export default useRestApiErrorDispatcher;
