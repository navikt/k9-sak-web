import { useGlobalUnhandledErrors } from './GlobalUnhandledErrorCatcher.js';
import { useMemo, useState } from 'react';
import { ErrorModal } from './ui/ErrorModal.js';

/**
 * Denne viser siste feil som har oppstått til bruker. Merk at viss det oppstår fleire feil fortløpande vil den kun vise siste,
 * så bør alltid kombinerast med anna feilvisning som viser alle feil (meir i bakgrunnen).
 */
export const GlobalErrorModal = () => {
  const { globalErrors } = useGlobalUnhandledErrors();
  const [closedError, setClosedError] = useState<Error | undefined>(undefined);
  const modalError = useMemo(() => {
    const lastError = globalErrors[globalErrors.length - 1];
    if (closedError != lastError) {
      return lastError;
    } else {
      return undefined;
    }
  }, [globalErrors, closedError]);
  const reload = () => window.location.reload();

  return <ErrorModal error={modalError} onClose={() => setClosedError(modalError)} onReload={reload} />;
};
