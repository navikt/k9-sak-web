import { AuthAbortedError } from '@k9-sak-web/backend/shared/auth/AuthAbortedError.js';
import { resolveLoginURL, withRedirectToCurrentLocation } from '@k9-sak-web/backend/shared/auth/resolveLoginURL.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { captureException, withScope } from '@sentry/browser';
import { Component, type ErrorInfo, type FC, type ReactNode } from 'react';
import { AuthAbortedPage } from '../auth/AuthAbortedPage.js';
import ErrorPage from './ErrorPage.js';
import ForbiddenPage from './ForbiddenPage.js';
import NotFoundPage from './NotFoundPage.js';
import UnauthorizedPage from './UnauthorizedPage.js';

export interface ErrorFallbackProps {
  readonly error: Error;
  readonly sentryId: string | undefined;
  readonly reset: () => void;
}

interface OwnProps {
  errorMessageCallback?: (error: string) => void;
  children: ReactNode;
  doNotShowErrorPage?: boolean;
  doNotShowErrorPageMaxCount?: number;
  errorFallback?: FC<ErrorFallbackProps>;
}

interface State {
  error: Error | null;
  sentryId: string | undefined;
}

const initialState: State = { error: null, sentryId: undefined };

export class ErrorBoundary extends Component<OwnProps, State> {
  static defaultProps = {
    doNotShowErrorPage: false,
  };

  private errorCount = 0;

  constructor(props: OwnProps) {
    super(props);
    this.state = initialState;
  }

  static ensureError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    if (error == null) {
      return new Error('Feil fanga, men feilobjekt var null/undefined');
    }
    return new Error(String(error));
  }

  // Vi ønsker ikkje å rapportere alle feil til Sentry, feks viss har utgått sesjon.
  // Legg til fleire her ved behov.
  protected static shouldReportToSentry(error: Error | null): boolean {
    const apiError = ExtendedApiError.findInError(error);
    if (apiError != null) {
      const doNotReport = apiError.isUnauthorized;
      return !doNotReport;
    }
    return true;
  }

  override componentDidCatch(anyError: any, info: ErrorInfo): void {
    const { errorMessageCallback } = this.props;
    const error = ErrorBoundary.ensureError(anyError);
    let sentryId: string | undefined;
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
      errorMessageCallback(
        [
          error.toString(),
          info.componentStack
            ?.split('\n')
            .map(line => line.trim())
            .find(line => !!line),
        ].join(' '),
      );
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
      doNotShowErrorPage,
      errorMessageCallback,
      doNotShowErrorPageMaxCount = 16,
    } = this.props;
    const { error, sentryId } = this.state;
    // I utgangspunktet visast feilside viss doNotShowErrorPage ikkje er true. Ellers blir berre errorMessageCallback
    // kalla, og rendering fortsetter etter beste evne.
    let showErrorPage = !doNotShowErrorPage;
    if (!showErrorPage) {
      // Dette kan likevel bli overstyrt slik at feilside visast viss errorMessageCallback ikkje er definert, eller viss
      // det har oppstått meir enn 16 feil sidan sist ErrorBoundary vart resatt, for å unngå evig loop viss ein feil gjenoppstår
      // for kvar rendering av children.
      if (errorMessageCallback == null) {
        console.info(`Ingen errorMessageCallback definert, vis separat feilside.`);
        showErrorPage = true;
      } else if (this.errorCount > doNotShowErrorPageMaxCount) {
        console.info(`Meir enn ${doNotShowErrorPageMaxCount} feil på rad, vis separat feilside.`);
        showErrorPage = true;
      }
    }

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
        return <ErrorPage sentryId={sentryId} />;
      }
    }

    return children;
  }
}

export default ErrorBoundary;
