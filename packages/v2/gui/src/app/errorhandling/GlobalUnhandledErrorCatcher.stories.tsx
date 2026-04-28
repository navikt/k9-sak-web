import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { useState } from 'react';
import {
  GlobalUnhandledErrorCatcher,
  type GlobalUnhandledErrorCatcherProps,
  useGlobalUnhandledErrors,
} from './GlobalUnhandledErrorCatcher.js';
import { useMutation } from '@tanstack/react-query';
import { withTopDekoratør } from '../../storybook/decorators/withTopDekoratør.js';
import { TopErrorPanel } from './ui/TopErrorPanel.js';

interface ErrorThrowingComponentProps {
  readonly throwInInitialRender?: boolean;
}

type ErrorHandlingDemoAppProps = ErrorThrowingComponentProps & Omit<GlobalUnhandledErrorCatcherProps, 'children'>;

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

const ErrorHandlingDemoApp = ({ throwInInitialRender, maxErrorCount }: ErrorHandlingDemoAppProps) => {
  return (
    <>
      <GlobalUnhandledErrorCatcher maxErrorCount={maxErrorCount}>
        <TopErrorPanel />
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
  title: 'gui/app/errorhandling/GlobalUnhandledErrorCatcher',
  component: ErrorHandlingDemoApp,
  parameters: {
    layout: 'fullscreen',
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  decorators: [withTopDekoratør()],
} satisfies Meta<typeof ErrorHandlingDemoApp>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoError: Story = {};

export const DefaultErrorInRender: Story = {
  args: {
    throwInInitialRender: true,
  },
};

export const RenderingError: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Throw render error' }));
  },
};

export const TooManyErrors: Story = {
  args: {
    maxErrorCount: 4, // Reduser denne for å forenkle testing av overskridelse
  },
  play: async ({ canvas, args }) => {
    const throwErrorButton = canvas.getByRole('button', { name: 'Throw error' });

    // Klikk "Throw error" to gonger
    await userEvent.click(throwErrorButton);
    await userEvent.click(throwErrorButton);

    // Klikk "Throw render error" tre gonger
    await userEvent.click(canvas.getByRole('button', { name: 'Throw render error' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Throw render error' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Throw render error' }));

    // Verifiser at "For mange feil" meldinga blir vist
    await expect(canvas.getByText(`For mange feil (${(args.maxErrorCount ?? 0) + 1})`)).toBeInTheDocument();
  },
};
