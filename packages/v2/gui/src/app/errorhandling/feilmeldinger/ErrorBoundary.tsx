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

export interface ErrorFallbackProps {
  readonly error: Error;
  readonly sentryId: string | undefined;
  readonly reset: () => void;
}

export interface ErrorBoundaryProps {
  errorMessageCallback?: (error: Record<string, unknown>) => void;
  children: ReactNode;
  maxErrorCount?: number;
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
    const { errorMessageCallback } = this.props;
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
          this.sentryId = captureException(error);
        });
      }
      if (errorMessageCallback != null) {
        const componentStackString = info.componentStack
          ?.split('\n')
          .map(line => line.trim())
          .find(line => !!line);
        errorMessageCallback({ message: `${error.toString()} ${componentStackString}`.trim() });
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
    const { errorFallback: ErrorFallback, children, errorMessageCallback, maxErrorCount = 16 } = this.props;
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
      } else if (errorMessageCallback == null || children == null) {
        return this.#renderErrorMessage(error);
      }
    }

    return children;
  }
}

export default ErrorBoundary;
