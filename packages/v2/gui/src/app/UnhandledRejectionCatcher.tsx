import { useEffect, useState } from 'react';
import { TopplinjeAlerts } from './alerts/TopplinjeAlerts.js';
import { type ErrorWithAlertInfo, isErrorWithAlertInfo } from './alerts/AlertInfo.js';
import { SharedFeilDtoError } from '@k9-sak-web/backend/shared/errorhandling/SharedFeilDtoError.js';
import GeneralAsyncError from './alerts/GeneralAsyncError.ts';

/**
 * Fanger opp uhandterte promise rejections. Kan deretter avgjere om feil skal analyserast og vise feilmelding, eller
 * om den skal propagerast vidare og bli rapportert som uhandtert i nettlesaren.
 */
export const UnhandledRejectionCatcher = () => {
  const [errors, setErrors] = useState<ErrorWithAlertInfo[]>([]);
  const removeError = (errorId: number) => setErrors(errors.filter(err => err.errorId !== errorId));
  useEffect(() => {
    const addError = (err: ErrorWithAlertInfo) => setErrors(errors => [...errors, err]);
    const listener = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      if (isErrorWithAlertInfo(error)) {
        addError(error);
        // Avgjer om feil ikkje skal propagerast vidare oppover.
        // Valideringsfeil blir rekna som brukarfeil i utgangspunktet, så rapporterer det ikkje vidare automatisk
        if (error instanceof SharedFeilDtoError && error.erValideringsfeil) {
          event.preventDefault();
        }
        // XXX Legg til visning/handtering av andre feiltyper her.

        // Generelle feil blir og vist.
      } else if (error instanceof Error) {
        addError(new GeneralAsyncError(error.message, error));
      }
    };
    addEventListener('unhandledrejection', listener);
    return () => {
      removeEventListener('unhandledrejection', listener);
    };
  }, []);

  return <TopplinjeAlerts errors={errors} onErrorDismiss={err => removeError(err.errorId)} />;
};
