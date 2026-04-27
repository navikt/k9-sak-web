import React, { Component, type ReactNode } from 'react';
import { ensureError } from './ensureError.js';
import { shouldReportToSentry } from './sentry.js';
import { captureException, withScope } from '@sentry/browser';
import { SentryReportedError } from './SentryReportedError.js';
import { isErrorWithAlertInfo } from './alerts/AlertInfo.js';

export interface GlobalErrorBoundaryProps {
  readonly onError: (error: Error) => void;
  readonly children: ReactNode;
}

interface State {
  error: Error | null;
  sentryId: string | null;
}

/**
 * GlobalErrorBoundary fanger alle (react) render feil som ikkje blir fanga av andre ErrorBoundary lenger nede i
 * komponent hierarkiet. Den rapporterer alle feil til innsendt onError callback, og fortsetter å rendre children
 * som om ingenting har feila. Den er kun meint brukt i GlobalUnhandledErrorCatcher, og onError callback skal legge
 * rapportert feil til i globalErrors i GlobalUnhandledErrorCatcher, slik at separat komponent viser feil som har
 * oppstått på samme måte som andre feil fanga i GlobalUnhandledErrorCatcher.
 */
export class GlobalErrorBoundary extends Component<GlobalErrorBoundaryProps, State> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { error: null, sentryId: null };
  }

  override componentDidCatch(caught: unknown, info: React.ErrorInfo) {
    const { onError } = this.props;
    let error = ensureError(caught);
    let sentryId: string | null = null;
    if (shouldReportToSentry(error)) {
      withScope(scope => {
        if (info.componentStack != null) {
          scope.setExtra('componentStack', info.componentStack);
        }
        if (info.digest != null) {
          scope.setExtra('digest', info.digest);
        }
        if (isErrorWithAlertInfo(error)) {
          scope.setExtra('errorId', error.errorId);
        }
        sentryId = captureException(error);
      });
    }
    if (sentryId != null) {
      error = new SentryReportedError(error, sentryId);
    }
    this.setState({
      error,
      sentryId,
    });
    onError(error);
  }

  override render(): ReactNode {
    const { children } = this.props;
    return children;
  }
}
