import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { expect, fn } from 'storybook/test';
import ErrorBoundary, { type ErrorFallbackProps } from './ErrorBoundary.js';

const meta = {
  title: 'gui/app/errorhandling/feilmeldinger/ErrorBoundary',
  component: ErrorBoundary,
} satisfies Meta<typeof ErrorBoundary>;

export default meta;

type Story = StoryObj<typeof meta>;

const NonFailingChild = () => <p>Nothing to see here, move along.</p>;

const AlwaysFailingChild = () => {
  useEffect(() => {
    throw new Error('TEST FAIL');
  }, []);
  return <p>Error boundary should be displayed instead of this</p>;
};

export const ErrorBoundaryNotTriggered: Story = {
  args: {
    errorCallback: fn(),
    children: <NonFailingChild />,
  },
  play: async ({ args }) => {
    await expect(args.errorCallback).toHaveBeenCalledTimes(0);
  },
};

export const ErrorBoundaryTriggered: Story = {
  args: {
    children: <AlwaysFailingChild />,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading')).toHaveTextContent(
      'Det har oppstått en teknisk feil i denne behandlingen.',
    );
  },
};

export const ErrorBoundaryTriggeredCallback: Story = {
  args: {
    children: <AlwaysFailingChild />,
    errorCallback: fn(),
    errorFallback: () => <p>I failed</p>,
  },
  play: async ({ args }) => {
    await expect(args.errorCallback).toHaveBeenCalledOnce();
  },
};

const ErrorFallback = ({ error }: ErrorFallbackProps) => (
  <p>
    Feil: <span>{error.message}</span>
  </p>
);

export const ErrorBoundaryTriggeredFallback: Story = {
  args: {
    ...ErrorBoundaryTriggered.args,
    errorFallback: ErrorFallback,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Feil:')).toBeInTheDocument();
    await expect(canvas.getByText('TEST FAIL')).toBeInTheDocument();
  },
};
