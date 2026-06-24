import { createContext, type FC, type ReactNode, useEffect, useState, use, useCallback, useMemo } from 'react';
import { ensureError } from './ensureError.js';
import ErrorBoundary from './boundary/ErrorBoundary.js';
import { AppError } from './AppError.js';
import { shouldReportToSentry } from './sentry.js';
import { captureException } from '@sentry/browser';
import { ErrorModal } from './ui/ErrorModal.js';
import { resolveErrorViewProps } from './ui/resolveErrorViewProps.js';
import FeatureTogglesContext from '../../featuretoggles/FeatureTogglesContext.js';

interface GlobalUnhandledErrors {
  readonly globalErrors: ReadonlyArray<Error>;
  clearGlobalErrors(): void;
  addGlobalError(error: Error): void;
  legacyErrorNotifier(error: Error): void;
}

const empty: GlobalUnhandledErrors = {
  globalErrors: [],
  clearGlobalErrors() {},
  addGlobalError(error: Error) {
    throw new AppError({ message: 'addGlobalError called outside GlobalUnhandledErrorCatcher', cause: error });
  },
  legacyErrorNotifier(error: Error) {
    throw new AppError({ message: 'legacyErrorNotifier called outside GlobalUnhandledErrorCatcher', cause: error });
  },
};

// Kopiert frå Sentry sin EventFilters-integrasjon (DEFAULT_IGNORE_ERRORS). Desse feila blir filtrert vekk av Sentry
// før dei blir rapportert, så vi filtrerer dei òg vekk her slik at dei ikkje blir lagt til i globalErrors-lista.
// Sentry har fleire utelatelser i si liste som nok ikkje er relevante i k9-sak-web. Dei er derfor ikkje tatt med her.
const DEFAULT_IGNORE_ERRORS = [
  /^Script error\.?$/,
  /^Javascript error: Script error\.? on line 0$/,
  /^ResizeObserver loop completed with undelivered notifications\.$/,
  // The browser logs this when a ResizeObserver handler takes a bit longer. Usually this is not an actual issue though. It indicates slowness.
  /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/,
  // Random error that happens but not actionable or noticeable to end-users.
];

// Returnerer true dersom feilmeldinga ikkje matcher nokon av mønstera i DEFAULT_IGNORE_ERRORS, og feilen derfor skal handterast.
const dontIgnoreError = (error: Error): boolean => {
  return !DEFAULT_IGNORE_ERRORS.some(pattern => pattern.test(error.message));
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
  const { VIS_GLOBAL_ERRORMODAL } = use(FeatureTogglesContext);
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
      const error = ensureError(ev.error ?? ev.message ?? undefined);
      if (dontIgnoreError(error)) {
        addGlobalError(error);
      }
    };
    addEventListener('error', errorListener);
    return () => {
      removeEventListener('error', errorListener);
    };
  }, [addGlobalError]);
  useEffect(() => {
    const promiseRejectionListener = (ev: PromiseRejectionEvent) => {
      const error = ensureError(ev.reason);
      if (dontIgnoreError(error)) {
        addGlobalError(error);
      }
    };
    addEventListener('unhandledrejection', promiseRejectionListener);
    return () => {
      removeEventListener('unhandledrejection', promiseRejectionListener);
    };
  }, [addGlobalError]);

  const legacyErrorNotifier = useCallback(
    (error: Error) => {
      // error som kjem inn her blir ikkje ellers rapportert, så logg den til Sentry her.
      if (shouldReportToSentry(error)) {
        captureException(error);
      }
      addGlobalError(error);
    },
    [addGlobalError],
  );

  // Vis siste oppståtte feil i ErrorModal, så lenge den ikkje har blitt lukka etter visning
  const [lastClosedError, setLastClosedError] = useState<Error | undefined>(undefined);
  const modalError = useMemo(() => {
    const lastError = globalErrors[globalErrors.length - 1];
    if (lastClosedError != lastError) {
      return lastError;
    } else {
      return undefined;
    }
  }, [globalErrors, lastClosedError]);

  const lastErrorModalProps = modalError != null ? resolveErrorViewProps(modalError) : undefined;

  if (globalErrors.length > maxErrorCount) {
    const lastError = globalErrors.at(-1);
    throw new AppError({
      message: 'For mange feil oppsto uten at system ble lastet på nytt. Kan tyde på rekursiv feil.',
      cause: lastError,
    });
  }

  return (
    <GlobalUnhandledErrorsContext value={{ globalErrors, clearGlobalErrors, addGlobalError, legacyErrorNotifier }}>
      <ErrorBoundary errorCallback={addGlobalError}>{children}</ErrorBoundary>
      {VIS_GLOBAL_ERRORMODAL && (
        <ErrorModal errorProps={lastErrorModalProps} onClose={() => setLastClosedError(modalError)} />
      )}
    </GlobalUnhandledErrorsContext>
  );
};
