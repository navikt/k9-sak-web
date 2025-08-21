import { useEffect, useState } from 'react';
import { ApiError } from '@k9-sak-web/backend/ungsak/generated';
import { TopplinjeAlerts } from './alerts/TopplinjeAlerts.js';
import { K9SakApiError } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakApiError.js';
import { type ErrorWithAlertInfo, isErrorWithAlertInfo } from './alerts/AlertInfo.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/instrumentation/ExtendedApiError.js';

/**
 * Fanger opp uhandterte promise rejections. Kan deretter avgjere om feil skal analyserast og vise feilmelding, eller
 * om den skal propagerast vidare og bli rapportert som uhandtert i nettlesaren.
 */
export const UnhandledRejectionCatcher = () => {
  const [errors, setErrors] = useState<ErrorWithAlertInfo[]>([]);
  const removeError = (errorId: number) => setErrors(errors.filter(err => err.errorId !== errorId));
  useEffect(() => {
    const addError = (err: ErrorWithAlertInfo) => setErrors([...errors, err]);
    const listener = (event: PromiseRejectionEvent) => {
      let error = event.reason;
      if (error instanceof ApiError && !(error instanceof ExtendedApiError)) {
        error = new ExtendedApiError(error, null);
      }
      if (isErrorWithAlertInfo(error)) {
        addError(error);
        // Avgjer om feil ikkje skal propagerast vidare oppover.
        // Valideringsfeil blir rekna som brukarfeil i utgangspunktet, så rapporterer det ikkje vidare automatisk
        if (error instanceof K9SakApiError && error.erValideringsfeil) {
          event.preventDefault();
        }
      }
      // XXX Legg til visning/handtering av andre feiltyper her.

      // Feil som ikkje blir handtert her propagerer vidare og blir logga i konsoll og sentry, men blir ikkje vist til brukaren på noko anna måte.
      // Vurder å legge til generell visning av alle Error som blir fanga opp
      // else if(error instanceof Error) {
      //   addError(new GeneralAsyncError(error.message, error))
      // }
    };
    addEventListener('unhandledrejection', listener);
    return () => {
      removeEventListener('unhandledrejection', listener);
    };
  }, []);

  return <TopplinjeAlerts errors={errors} onErrorDismiss={err => removeError(err.errorId)} />;
};
