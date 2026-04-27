import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ErrorBoundaryProps } from './feilmeldinger/ErrorBoundary.js';
import { useState } from 'react';
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
    <p>
      In render error-throwing component. {shallRenderThrow ? throwError() : null}
      <button onClick={() => triggerRenderThrow(true)}>Throw render error</button>
    </p>
  );
};

const NormalErrorThrowingComponent = () => {
  const throwError = () => {
    throw new Error('Normal error');
  };
  return (
    <p>
      Normal error-throwing component. <button onClick={throwError}>Throw error</button>
    </p>
  );
};

const InAsyncErrorThrowingComponent = () => {
  const throwError = async () => {
    throw new Error('Async error');
  };
  return (
    <p>
      In async error-throwing component. <button onClick={throwError}>Throw async error</button>
    </p>
  );
};

const MutationThrowingComponent = () => {
  const throwingMutation = useMutation({
    mutationFn: async () => {
      throw new Error('Mutation error');
    },
  });
  return (
    <p>
      Mutation throwing error. <button onClick={() => throwingMutation.mutate()}>Throw in mutation</button>
    </p>
  );
};

const ErrorStatusDisplay = () => {
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

const ErrorHandlingDemoApp = ({ throwInInitialRender }: ErrorHandlingDemoAppProps) => {
  return (
    <>
      <GlobalUnhandledErrorCatcher>
        <h1>Demo app for demonstrating global top-level error handling</h1>
        <ErrorStatusDisplay />
        <InRenderErrorThrowingComponent throwInInitialRender={throwInInitialRender} />
        <NormalErrorThrowingComponent />
        <InAsyncErrorThrowingComponent />
        <MutationThrowingComponent />
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
} satisfies Meta<typeof ErrorHandlingDemoApp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoError: Story = {};

export const DefaultErrorInRender: Story = {
  args: {
    throwInInitialRender: true,
  },
};
