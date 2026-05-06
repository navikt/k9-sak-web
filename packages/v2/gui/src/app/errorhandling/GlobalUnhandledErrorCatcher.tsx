import { createContext, type FC, type ReactNode, useEffect, useState, use } from 'react';
import { ensureError } from './ensureError.js';
import { BigError, DefaultErrorMsg } from './feilmeldinger/BigError.js';
import ErrorBoundary from './feilmeldinger/ErrorBoundary.tsx';

interface GlobalUnhandledErrors {
  readonly globalErrors: ReadonlyArray<Error>;
  clearGlobalErrors(): void;
}

const empty: GlobalUnhandledErrors = {
  globalErrors: [],
  clearGlobalErrors() {},
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
  useEffect(() => {
    const errorListener = (ev: ErrorEvent) => {
      const error: Error = ensureError(ev.error);
      setGlobalErrors(prevErrors => [...prevErrors, error]);
    };
    addEventListener('error', errorListener);
    return () => {
      removeEventListener('error', errorListener);
    };
  }, []);
  useEffect(() => {
    const promiseRejectionListener = (ev: PromiseRejectionEvent) => {
      const error: Error = ensureError(ev.reason);
      setGlobalErrors(prevErrors => [...prevErrors, error]);
    };
    addEventListener('unhandledrejection', promiseRejectionListener);
    return () => {
      removeEventListener('unhandledrejection', promiseRejectionListener);
    };
  }, []);

  if (globalErrors.length > maxErrorCount) {
    return (
      <BigError title={`For mange feil (${globalErrors.length})`}>
        <p>For mange feil oppsto uten at system ble lastet på nytt. Kan tyde på rekursiv feil.</p>
        <DefaultErrorMsg />
      </BigError>
    );
  }

  return (
    <ErrorBoundary>
      <GlobalUnhandledErrorsContext value={{ globalErrors, clearGlobalErrors }}>
        {children}
      </GlobalUnhandledErrorsContext>
    </ErrorBoundary>
  );
};
