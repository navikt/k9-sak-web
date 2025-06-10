import { Component, type ReactNode, type ErrorInfo } from 'react';
import { captureException, withScope } from '@sentry/browser';
import ErrorPage from './ErrorPage.js';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/instrumentation/ExtendedApiError.js';
import UnauthorizedPage from './UnauthorizedPage.js';
import ForbiddenPage from './ForbiddenPage.js';
import NotFoundPage from './NotFoundPage.js';

interface OwnProps {
  errorMessageCallback?: (error: string) => void;
  children: ReactNode;
  doNotShowErrorPage?: boolean;
  doNotShowErrorPageMaxCount?: number;
}

interface State {
  error: Error | null;
  sentryId: string | undefined;
}

export class ErrorBoundary extends Component<OwnProps, State> {
  static defaultProps = {
    doNotShowErrorPage: false,
  };

  private errorCount = 0;

  constructor(props: OwnProps) {
    super(props);
    this.state = { error: null, sentryId: undefined };
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
    const { children, doNotShowErrorPage, errorMessageCallback, doNotShowErrorPageMaxCount = 16 } = this.props;
    const { error, sentryId } = this.state;
    // I utgangspunktet visast feilside viss doNotShowErrorPage ikkje er true. Ellers blir berre errorMessageCallback
    // kalla, og rendering fortsetter etter beste evne.
    let showErrorPage = !doNotShowErrorPage;
    if (!showErrorPage) {
      // Dette kan likevel bli overstyrt slik at feilside visast viss errorMessageCallback ikkje er definert, eller viss
      // det har oppstått meir enn 6 feil sidan sist ErrorBoundary vart resatt, for å unngå evig loop viss ein feil gjenoppstår
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
      // Utled feilside som skal visast.
      const apiError = ExtendedApiError.findInError(error);
      if (apiError != null) {
        if (apiError.isUnauthorized) {
          return <UnauthorizedPage />;
        }
        if (apiError.isForbidden) {
          return <ForbiddenPage />;
        }
        if (apiError.isNotFound) {
          return <NotFoundPage />;
        }
      }
      return <ErrorPage sentryId={sentryId} />;
    }

    return children;
  }
}

export default ErrorBoundary;
