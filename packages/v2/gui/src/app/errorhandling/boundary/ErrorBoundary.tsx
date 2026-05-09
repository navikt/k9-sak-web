import { Component, type ErrorInfo, type FC, type ReactNode } from 'react';
import { captureException, withScope } from '@sentry/browser';
import { ensureError } from '../ensureError.js';
import { sentryReportedErrorIdLookup, shouldReportToSentry } from '../sentry.js';
import { createErrorAndId, type ErrorAndId } from '../AlertInfo.js';
import { DefaultErrorView } from './DefaultErrorView.js';
import { CrashErrorView } from './CrashErrorView.js';

export interface ErrorBoundaryFallbackProps {
  readonly caught: ErrorAndId;
  readonly reset: () => void;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  maxErrorCount?: number;
  // If set, the ErrorBoundary will only report error to Sentry and this callback, not display error itself. May be combined with errorFallback.
  errorCallback?: (caught: ErrorAndId) => void;
  // If set the component given will be rendered instead of children
  errorFallback?: FC<ErrorBoundaryFallbackProps>;
  // If set, this ErrorBoundary will only catch errors for which the function returns true. Others will propagate to the next boundary.
  filter?: (error: Error) => boolean;
}

interface State {
  caught: ErrorAndId | null;
}

const initialState: State = { caught: null };

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  private errorCount = 0;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = initialState;
  }

  // Vi ønsker ikkje å rapportere alle feil til Sentry, feks viss har utgått sesjon.
  // Legg til fleire her ved behov.
  protected static shouldReportToSentry(error: Error | null): boolean {
    return shouldReportToSentry(error);
  }

  static getDerivedStateFromError(anyError: unknown): State {
    const caught = createErrorAndId(ensureError(anyError));
    return { caught };
  }

  override componentDidCatch(_: any, info: ErrorInfo): void {
    const { errorCallback, filter } = this.props;
    const { caught } = this.state;
    if (caught != null) {
      // Viss filter er sett og returnerer false, ikkje rapporter eller kall callback — feilen blir kasta vidare i render()
      if (filter != null && !filter(caught.error)) {
        return;
      }
      this.errorCount++;
      if (ErrorBoundary.shouldReportToSentry(caught.error)) {
        withScope(scope => {
          if (info.componentStack != null) {
            scope.setExtra('componentStack', info.componentStack);
          }
          if (info.digest != null) {
            scope.setExtra('digest', info.digest);
          }
          scope.setTag('errorId', caught.errorId);
          const sentryId = captureException(caught.error);
          sentryReportedErrorIdLookup.set(caught.error, sentryId); // Slik at vi kan slå opp igjen sentryId i ErrorInfoCopy etc
        });
      }
      if (errorCallback != null) {
        errorCallback(caught);
      }
    }
  }

  override render(): ReactNode {
    const { errorFallback: ErrorFallback, children, errorCallback, maxErrorCount = 16, filter } = this.props;
    const { caught } = this.state;
    if (caught != null) {
      // Viss filter er sett og returnerer false for denne feilen, kast den vidare til neste ErrorBoundary
      if (filter != null && !filter(caught.error)) {
        throw caught.error;
      }
      const reset = () => {
        // Vurder å legge til tanstack query reset her
        this.setState(initialState);
      };
      // Viss errorCount har gått over grense vis separat feilside utan å rendre children eller errorFallback, sidan det tyder på rekursiv/evig feilsituasjon
      if (this.errorCount > maxErrorCount) {
        return <CrashErrorView caught={caught} reset={reset} />;
      } else if (ErrorFallback != null) {
        // Viss errorFallback er angitt, vis den istadenfor standard feilside
        return <ErrorFallback caught={caught} reset={reset} />;
      } else if (errorCallback == null || children == null) {
        return <DefaultErrorView caught={caught} reset={reset} />;
      }
    }

    return children;
  }
}

export default ErrorBoundary;
