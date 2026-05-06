import { createContext, type FC, type ReactNode, useEffect, useState, use, useCallback } from 'react';
import { ensureError } from './ensureError.js';
import { BigError, DefaultErrorMsg } from './feilmeldinger/BigError.js';
import ErrorBoundary from './feilmeldinger/ErrorBoundary.js';
import { FrontendError } from './FrontendError.js';

interface GlobalUnhandledErrors {
  readonly globalErrors: ReadonlyArray<Error>;
  clearGlobalErrors(): void;
  addError(error: Error): void;
}

const empty: GlobalUnhandledErrors = {
  globalErrors: [],
  clearGlobalErrors() {},
  addError(error: Error) {
    throw new FrontendError('addError called outside GlobalUnhandledErrorCatcher', error);
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
  const addError = useCallback(
    (error: Error) => {
      setGlobalErrors(prevErrors => [...prevErrors, error]);
    },
    [setGlobalErrors],
  );
  useEffect(() => {
    const errorListener = (ev: ErrorEvent) => {
      const error: Error = ensureError(ev.error);
      addError(error);
    };
    addEventListener('error', errorListener);
    return () => {
      removeEventListener('error', errorListener);
    };
  }, [addError]);
  useEffect(() => {
    const promiseRejectionListener = (ev: PromiseRejectionEvent) => {
      const error: Error = ensureError(ev.reason);
      addError(error);
    };
    addEventListener('unhandledrejection', promiseRejectionListener);
    return () => {
      removeEventListener('unhandledrejection', promiseRejectionListener);
    };
  }, [addError]);

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
      <GlobalUnhandledErrorsContext value={{ globalErrors, clearGlobalErrors, addError }}>
        <ErrorBoundary errorCallback={addError}>{children}</ErrorBoundary>
      </GlobalUnhandledErrorsContext>
    </ErrorBoundary>
  );
};
