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
  doNotShowErrorPageMaxCount?: number;
  errorFallback?: FC<ErrorFallbackProps>;
}

interface State {
  error: Error | null;
  sentryId: string | undefined;
}

const initialState: State = { error: null, sentryId: undefined };

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
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

  override componentDidCatch(anyError: any, info: ErrorInfo): void {
    const { errorMessageCallback } = this.props;
    const error = ErrorBoundary.ensureError(anyError);
    let sentryId: string | undefined = undefined;
    if (ErrorBoundary.shouldReportToSentry(error)) {
      withScope(scope => {
        if (info.componentStack != null) {
          scope.setExtra('componentStack', info.componentStack);
        }
        if (info.digest != null) {
          scope.setExtra('digest', info.digest);
        }
        sentryId = captureException(error);
      });
    }
    this.setState({
      error,
      sentryId,
    });

    if (errorMessageCallback != null) {
      const componentStackString = info.componentStack
        ?.split('\n')
        .map(line => line.trim())
        .find(line => !!line);
      errorMessageCallback({ message: `${error.toString()} ${componentStackString}`.trim() });
    }

    if (error != null) {
      this.errorCount++;
    }

    // eslint-disable-next-line no-console
    console.error(error);
  }

  override render(): ReactNode {
    const {
      errorFallback: ErrorFallback,
      children,
      errorMessageCallback,
      doNotShowErrorPageMaxCount = 16,
    } = this.props;
    const { error, sentryId } = this.state;
    // Separat feilside visast viss errorMessageCallback ikkje er satt, eller det har oppstått for mange feil ved visning av errorFallback
    const showErrorPage = errorMessageCallback == null || this.errorCount > doNotShowErrorPageMaxCount;

    if (error != null && showErrorPage) {
      if (ErrorFallback != null) {
        const reset = () => {
          this.setState(initialState);
        };
        return <ErrorFallback error={error} sentryId={sentryId} reset={reset} />;
      } else {
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
        return <ErrorPage sentryId={sentryId} errorMessage={error.message} />;
      }
    }

    return children;
  }
}

export default ErrorBoundary;
