import { useGlobalUnhandledErrors } from './GlobalUnhandledErrorCatcher.js';
import { useMemo, useState } from 'react';
import { ErrorModal } from './ui/ErrorModal.js';
import type { ErrorAndId } from './AlertInfo.js';

/**
 * Denne viser siste feil som har oppstått til bruker. Merk at viss det oppstår fleire feil fortløpande vil den kun vise siste,
 * så bør alltid kombinerast med anna feilvisning som viser alle feil (meir i bakgrunnen).
 */
export const GlobalErrorModal = () => {
  const { globalErrors } = useGlobalUnhandledErrors();
  const [closedError, setClosedError] = useState<ErrorAndId | undefined>(undefined);
  const modalErrorAndId = useMemo(() => {
    const lastErrorAndId = globalErrors[globalErrors.length - 1];
    if (closedError != lastErrorAndId) {
      return lastErrorAndId;
    } else {
      return undefined;
    }
  }, [globalErrors, closedError]);

  return <ErrorModal errorAndId={modalErrorAndId} onClose={() => setClosedError(modalErrorAndId)} />;
};
