import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { expect, fn } from 'storybook/test';
import ErrorBoundary, { type ErrorBoundaryFallbackProps } from './ErrorBoundary.js';
import { FrontendError } from '../FrontendError.js';

const meta = {
  title: 'gui/app/errorhandling/boundary/ErrorBoundary',
  component: ErrorBoundary,
} satisfies Meta<typeof ErrorBoundary>;

export default meta;

type Story = StoryObj<typeof meta>;

const NonFailingChild = () => <p>Nothing to see here, move along.</p>;

const AlwaysFailingChild = () => {
  useEffect(() => {
    throw new FrontendError('TEST FAIL');
  }, []);
  return <p>Error boundary should be displayed instead of this</p>;
};

const BaseErrorChild = () => {
  useEffect(() => {
    throw new Error('BASE ERROR');
  }, []);
  return <p>Skal ikkje visast</p>;
};

export const NotTriggered: Story = {
  args: {
    errorCallback: fn(),
    children: <NonFailingChild />,
  },
  play: async ({ args }) => {
    await expect(args.errorCallback).toHaveBeenCalledTimes(0);
  },
};

export const DefaultFallback: Story = {
  args: {
    children: <AlwaysFailingChild />,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading')).toHaveTextContent('Uventet feil');
  },
};

export const CustomErrorFallback: Story = {
  args: {
    ...DefaultFallback.args,
    errorFallback: ({ error }: ErrorBoundaryFallbackProps) => <p>Feil: {error.message}</p>,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Feil: TEST FAIL')).toBeInTheDocument();
  },
};

export const ErrorCallbackAndErrorFallback: Story = {
  args: {
    children: <AlwaysFailingChild />,
    errorCallback: fn(),
    errorFallback: () => <p>I failed</p>,
  },
  play: async ({ args }) => {
    await expect(args.errorCallback).toHaveBeenCalledOnce();
  },
};

// Utløser CrashErrorView fallback pga gjentakande feil i ErrorBoundary rendering ved å sette errorCallback uten
// errorFallback, slik at ErrorBoundary fortsetter å rendre children, som i dette tilfellet alltid feiler
export const AlwaysCrashingFallback: Story = {
  args: {
    ...DefaultFallback.args,
    errorCallback: fn(),
  },
  parameters: {
    layout: 'fullscreen',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Uventet mange feil oppsto')).toBeInTheDocument();
    await expect(canvas.getByText('TEST FAIL')).toBeInTheDocument();
    await expect(canvas.getByText('rapporter informasjonen over i porten', { exact: false })).toBeInTheDocument();
  },
};

// Filter som berre fangar FrontendError — vanleg Error blir sendt vidare til ytre boundary
export const FilterCatchesMatching: Story = {
  args: {
    children: <AlwaysFailingChild />,
    filter: (error: Error) => error instanceof FrontendError,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading')).toHaveTextContent('Uventet feil');
  },
};

// Filter som ikkje matcher feilen — ytre ErrorBoundary fangar den i staden
export const FilterPropagatesNonMatching: StoryObj = {
  render: () => (
    <ErrorBoundary errorFallback={({ error }) => <p>Ytre boundary fanga: {error.message}</p>}>
      <ErrorBoundary filter={(error: Error) => error instanceof FrontendError}>
        <BaseErrorChild />
      </ErrorBoundary>
    </ErrorBoundary>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Ytre boundary fanga: BASE ERROR')).toBeInTheDocument();
  },
};
