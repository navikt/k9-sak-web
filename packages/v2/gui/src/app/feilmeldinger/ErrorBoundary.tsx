import { Component, type ReactNode, type ErrorInfo } from 'react';
import { captureException, withScope } from '@sentry/browser';
import ErrorPage from './ErrorPage.js';

interface OwnProps {
  errorMessageCallback: (error: any) => void;
  children: ReactNode;
  doNotShowErrorPage?: boolean;
}

interface State {
  hasError: boolean;
  sentryId: string | undefined;
}

export class ErrorBoundary extends Component<OwnProps, State> {
  static defaultProps = {
    doNotShowErrorPage: false,
  };

  constructor(props: OwnProps) {
    super(props);
    this.state = { hasError: false, sentryId: undefined };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    const { errorMessageCallback } = this.props;

    withScope(scope => {
      if (info.componentStack != null) {
        scope.setExtra('componentStack', info.componentStack);
      }
      if (info.digest != null) {
        scope.setExtra('digest', info.digest);
      }
      const sentryId = captureException(error);
      this.setState({
        ...this.state,
        sentryId,
      });
    });

    errorMessageCallback(
      [
        error.toString(),
        info.componentStack
          ?.split('\n')
          .map(line => line.trim())
          .find(line => !!line),
      ].join(' '),
    );

    // eslint-disable-next-line no-console
    console.error(error);
  }

  override render(): ReactNode {
    const { children, doNotShowErrorPage } = this.props;
    const { hasError, sentryId } = this.state;

    return hasError && !doNotShowErrorPage ? <ErrorPage sentryId={sentryId} /> : children;
  }
}

export default ErrorBoundary;
