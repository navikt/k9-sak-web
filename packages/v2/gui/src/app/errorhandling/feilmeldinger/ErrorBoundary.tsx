import { Component, type ReactNode, type ErrorInfo, type FC } from 'react';
import { captureException, withScope } from '@sentry/browser';
import ErrorPage from './ErrorPage.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import UnauthorizedPage from './UnauthorizedPage.js';
import ForbiddenPage from './ForbiddenPage.js';
import NotFoundPage from './NotFoundPage.js';
import { resolveLoginURL, withRedirectToCurrentLocation } from '@k9-sak-web/backend/shared/auth/resolveLoginURL.js';
import { AuthAbortedError } from '@k9-sak-web/backend/shared/auth/AuthAbortedError.js';
import { AuthAbortedPage } from '../../auth/AuthAbortedPage.js';
import { ensureError } from '../ensureError.js';
import { shouldReportToSentry } from '../sentry.js';
import { isAlertInfo } from '../alerts/AlertInfo.js';
import { SentryReportedError } from '../SentryReportedError.js';

export interface ErrorFallbackProps {
  readonly error: Error;
  readonly sentryId: string | undefined;
  readonly reset: () => void;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  maxErrorCount?: number;
  // If set, the ErrorBoundary will only report error to Sentry and this callback, not display error itself. May be combined with errorFallback.
  errorCallback?: (error: Error) => void;
  // If set the component given will be rendered instead of children or error message from ErrorBoundary
  errorFallback?: FC<ErrorFallbackProps>;
}

interface State {
  error: Error | null;
}

const initialState: State = { error: null };

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  private sentryId: string | undefined;
  private errorCount = 0;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = initialState;
  }

  static ensureError(error: unknown): Error {
    return ensureError(error);
  }

  // Vi ønsker ikkje å rapportere alle feil til Sentry, feks viss har utgått sesjon.
  // Legg til fleire her ved behov.
  protected static shouldReportToSentry(error: Error | null): boolean {
    return shouldReportToSentry(error);
  }

  static getDerivedStateFromError(anyError: unknown): State {
    const error = ErrorBoundary.ensureError(anyError);
    return { error };
  }

  override componentDidCatch(_: any, info: ErrorInfo): void {
    const { errorCallback } = this.props;
    const { error } = this.state;
    if (error != null) {
      this.errorCount++;
      if (ErrorBoundary.shouldReportToSentry(error)) {
        withScope(scope => {
          if (info.componentStack != null) {
            scope.setExtra('componentStack', info.componentStack);
          }
          if (info.digest != null) {
            scope.setExtra('digest', info.digest);
          }
          if (isAlertInfo(error)) {
            scope.setTag('errorId', error.errorId);
          }
          this.sentryId = captureException(error);
        });
      }
      if (errorCallback != null) {
        errorCallback(this.sentryId != null ? new SentryReportedError(error, this.sentryId) : error);
      }
    }
  }

  #renderErrorMessage(error: Error): ReactNode {
    // Utled feilside som skal visast.
    const apiError = ExtendedApiError.findInError(error);
    if (apiError != null) {
      if (apiError.isUnauthorized) {
        const loginUrl = withRedirectToCurrentLocation(resolveLoginURL(apiError.location));
        if (loginUrl != null) {
          return <UnauthorizedPage loginUrl={loginUrl.toString()} />;
        } else {
          return <UnauthorizedPage loginUrl="/" />;
        }
      }
      if (apiError.isForbidden) {
        return <ForbiddenPage />;
      }
      if (apiError.isNotFound) {
        return <NotFoundPage />;
      }
    }
    if (error instanceof AuthAbortedError) {
      return <AuthAbortedPage retryURL={error.retryURL} />;
    }
    return <ErrorPage sentryId={this.sentryId} errorMessage={error.message} />;
  }

  override render(): ReactNode {
    const { errorFallback: ErrorFallback, children, errorCallback, maxErrorCount = 16 } = this.props;
    const { error } = this.state;
    if (error != null) {
      // Viss errorCount har gått over grense vis separat feilside uten å rendre children eller errorFallback, sidan det tyder på rekursiv/evig feilsituasjon
      if (this.errorCount > maxErrorCount) {
        return this.#renderErrorMessage(error);
      } else if (ErrorFallback != null) {
        // Viss errorFallback er angitt, vis den istadenfor standard feilside
        const reset = () => {
          this.setState(initialState);
        };
        return <ErrorFallback error={error} sentryId={this.sentryId} reset={reset} />;
      } else if (errorCallback == null || children == null) {
        return this.#renderErrorMessage(error);
      }
    }

    return children;
  }
}

export default ErrorBoundary;
