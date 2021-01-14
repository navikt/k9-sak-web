import React, { Component, ReactNode, ErrorInfo } from 'react';
import { captureException, withScope } from '@sentry/browser';

import { ErrorPage } from '@k9-sak-web/sak-infosider';

interface OwnProps {
  errorMessageCallback: (error: any) => void;
  children: ReactNode;
  doNotShowErrorPage?: boolean;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<OwnProps, State> {
  static defaultProps = {
    doNotShowErrorPage: false,
  };

  constructor(props: OwnProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const { errorMessageCallback } = this.props;

    withScope(scope => {
      Object.keys(info).forEach(key => {
        scope.setExtra(key, info[key]);
        captureException(error);
      });
    });

    errorMessageCallback(
      [
        error.toString(),
        info.componentStack
          .split('\n')
          .map(line => line.trim())
          .find(line => !!line),
      ].join(' '),
    );

    // eslint-disable-next-line no-console
    console.error(error);
  }

  render(): ReactNode {
    const { children, doNotShowErrorPage } = this.props;
    const { hasError } = this.state;

    return hasError && !doNotShowErrorPage ? <ErrorPage /> : children;
  }
}

export default ErrorBoundary;
