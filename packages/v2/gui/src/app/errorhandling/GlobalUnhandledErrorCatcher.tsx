import { createContext, type FC, type ReactNode, useEffect, useState, use, useCallback } from 'react';
import { ensureError } from './ensureError.js';
import ErrorBoundary from './boundary/ErrorBoundary.js';
import { FrontendError } from './FrontendError.js';

interface GlobalUnhandledErrors {
  readonly globalErrors: ReadonlyArray<Error>;
  clearGlobalErrors(): void;
  addGlobalError(error: Error): void;
}

const empty: GlobalUnhandledErrors = {
  globalErrors: [],
  clearGlobalErrors() {},
  addGlobalError(error: Error) {
    throw new FrontendError('addGlobalError called outside GlobalUnhandledErrorCatcher', error);
  },
};

const GlobalUnhandledErrorsContext = createContext<GlobalUnhandledErrors>(empty);

export const useGlobalUnhandledErrors = () => {
  return use(GlobalUnhandledErrorsContext);
};

export interface GlobalUnhandledErrorCatcherProps {
  // Viss globalErrors får så mange feil kan det tyde på ein evig feil-loop.
  // Avbryter då all rendering og viser krasj melding.
  readonly maxErrorCount?: number;
  readonly children?: ReactNode;
}

/**
 * Fanger opp alle uhandterte feil og promise rejections. Feil-liste blir tilgjengeleggjort gjennom context i useGlobalUnhandledErrors
 * slik at andre komponenter lenger nede i hierarkiet kan liste dei ut/slette alle feil frå lista.
 * <p>
 *   Viss error event.error ikkje er av type Error (eller subtype), blir den konvertert til Error før den blir lagt til i lista.
 * </p>
 */
export const GlobalUnhandledErrorCatcher: FC<GlobalUnhandledErrorCatcherProps> = ({ children, maxErrorCount = 50 }) => {
  const [globalErrors, setGlobalErrors] = useState<Error[]>([]);
  const clearGlobalErrors = () => setGlobalErrors([]);
  const addGlobalError = useCallback(
    (error: Error) => {
      setGlobalErrors(prevErrors => [...prevErrors, error]);
    },
    [setGlobalErrors],
  );
  useEffect(() => {
    const errorListener = (ev: ErrorEvent) => {
      const error = ensureError(ev.error);
      addGlobalError(error);
    };
    addEventListener('error', errorListener);
    return () => {
      removeEventListener('error', errorListener);
    };
  }, [addGlobalError]);
  useEffect(() => {
    const promiseRejectionListener = (ev: PromiseRejectionEvent) => {
      const error = ensureError(ev.reason);
      addGlobalError(error);
    };
    addEventListener('unhandledrejection', promiseRejectionListener);
    return () => {
      removeEventListener('unhandledrejection', promiseRejectionListener);
    };
  }, [addGlobalError]);

  if (globalErrors.length > maxErrorCount) {
    const lastError = globalErrors.at(-1);
    throw new FrontendError(
      'For mange feil oppsto uten at system ble lastet på nytt. Kan tyde på rekursiv feil.',
      lastError,
    );
  }

  return (
    <GlobalUnhandledErrorsContext value={{ globalErrors, clearGlobalErrors, addGlobalError }}>
      <ErrorBoundary errorCallback={addGlobalError}>{children}</ErrorBoundary>
    </GlobalUnhandledErrorsContext>
  );
};
