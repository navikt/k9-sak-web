import type { Meta, StoryObj } from '@storybook/react-vite';
import ErrorBoundary, { type ErrorBoundaryProps } from './feilmeldinger/ErrorBoundary.js';
import { action } from 'storybook/actions';
import { useState } from 'react';
import withFeatureToggles from '../../storybook/decorators/withFeatureToggles.js';
import { GlobalUnhandledErrorCatcher, useGlobalUnhandledErrors } from './GlobalUnhandledErrorCatcher.js';
import { useMutation } from '@tanstack/react-query';

interface ErrorThrowingComponentProps {
  readonly throwInInitialRender?: boolean;
}

interface ErrorHandlingDemoAppProps extends ErrorThrowingComponentProps, Omit<ErrorBoundaryProps, 'children'> {}

const InRenderErrorThrowingComponent = ({ throwInInitialRender }: ErrorThrowingComponentProps) => {
  const [shallRenderThrow, triggerRenderThrow] = useState(throwInInitialRender ?? false);
  const throwError = () => {
    throw new Error('In render error');
  };
  return (
    <>
      <p>
        In render error-throwing component. {shallRenderThrow ? throwError() : null}
        <button onClick={() => triggerRenderThrow(true)}>Throw render error</button>
      </p>
    </>
  );
};

const NormalErrorThrowingComponent = () => {
  console.debug('NormalErrorThrowingComponent render');
  const throwError = () => {
    throw new Error('Normal error');
  };
  return (
    <>
      <p>
        Normal error-throwing component. <button onClick={throwError}>Throw error</button>
      </p>
    </>
  );
};

const InAsyncErrorThrowingComponent = () => {
  const throwError = async () => {
    throw new Error('Async error');
  };
  return (
    <>
      <p>
        In async error-throwing component. <button onClick={throwError}>Throw async error</button>
      </p>
    </>
  );
};

const MutationThrowingComponent = () => {
  const throwingMutation = useMutation({
    mutationFn: async () => {
      throw new Error('Mutation error');
    },
  });
  return (
    <>
      <p>
        Mutation throwing error. <button onClick={() => throwingMutation.mutate()}>Throw in mutation</button>
      </p>
    </>
  );
};

const ErrorStatusDisplay = () => {
  console.debug('ErrorStatusDisplay render');
  const { globalErrors, clearGlobalErrors } = useGlobalUnhandledErrors();
  return (
    <>
      <p>
        Global handler caught {globalErrors.length} errors so far.
        <button onClick={clearGlobalErrors}>Clear</button>
      </p>
    </>
  );
};

const ErrorHandlingDemoApp = ({
  throwInInitialRender,
  doNotShowErrorPage,
  errorMessageCallback,
}: ErrorHandlingDemoAppProps) => {
  console.debug('ErrorHandlingDemoApp render');
  const [errorCount, setErrorCount] = useState(0);
  const errCB = (errMsg: string) => {
    errorMessageCallback?.(errMsg);
    setErrorCount(prevState => prevState + 1);
  };
  return (
    <>
      <GlobalUnhandledErrorCatcher>
        <ErrorBoundary doNotShowErrorPage={doNotShowErrorPage} errorMessageCallback={errCB}>
          <h1>Demo app for demonstrating various error handling</h1>
          <p>Error boundary caught {errorCount} errors so far.</p>
          <ErrorStatusDisplay />
          <InRenderErrorThrowingComponent throwInInitialRender={throwInInitialRender} />
          <NormalErrorThrowingComponent />
          <InAsyncErrorThrowingComponent />
          <MutationThrowingComponent />
        </ErrorBoundary>
      </GlobalUnhandledErrorCatcher>
    </>
  );
};

const meta = {
  title: 'gui/app/errorhandling/ErrorHandling',
  component: ErrorHandlingDemoApp,
  parameters: {
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  decorators: [withFeatureToggles({ VIS_ALLE_ASYNC_ERRORS: true })],
} satisfies Meta<typeof ErrorHandlingDemoApp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoError: Story = {};

export const DefaultErrorInRender: Story = {
  args: {
    throwInInitialRender: true,
  },
};

export const DoNotShowErrorPage: Story = {
  args: {
    throwInInitialRender: false,
    doNotShowErrorPage: true,
    errorMessageCallback: action('errorMessageCallback'),
  },
};
