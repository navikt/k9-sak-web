import { useEffect, useState } from 'react';
import { ApiError } from '@navikt/k9-klage-typescript-client';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/instrumentation/ExtendedApiError.js';
import { TopplinjeAlerts } from './alerts/TopplinjeAlerts.js';
import { K9SakApiError } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakApiError.js';

/**
 * Fanger opp uhandterte promise rejections. Kan deretter avgjere om feil skal analyserast og vise feilmelding, eller
 * om den skal propagerast vidare og bli rapportert som uhandtert i nettlesaren.
 */
export const UnhandledRejectionCatcher = () => {
  const [apiErrors, setApiErrors] = useState<ExtendedApiError[]>([]);
  const removeError = (randomId: number) => setApiErrors(apiErrors.filter(err => err.randomId !== randomId));
  useEffect(() => {
    const addApiError = (err: ExtendedApiError) => setApiErrors([...apiErrors, err]);
    const listener = (event: PromiseRejectionEvent) => {
      let error = event.reason;
      if (error instanceof ApiError && !(error instanceof ExtendedApiError)) {
        error = new ExtendedApiError(error, null);
      }
      if (error instanceof ExtendedApiError) {
        addApiError(error);
        // Avgjer om feil ikkje skal rapporterast vidare.
        // Valideringsfeil blir rekna som brukarfeil i utgangspunktet, så rapporterer det ikkje vidare automatisk
        if (error instanceof K9SakApiError && error.erValideringsfeil) {
          event.preventDefault();
        }
      }
      // XXX Legg til visning/handtering av andre feiltyper her.
      // Feil som ikkje blir handtert her propagerer vidare og blir logga i konsoll og sentry, men blir ikkje vist til brukaren på noko anna måte.
    };
    addEventListener('unhandledrejection', listener);
    return () => {
      removeEventListener('unhandledrejection', listener);
    };
  }, []);

  return <TopplinjeAlerts apiErrors={apiErrors} onApiErrorDismiss={err => removeError(err.randomId)} />;
};
