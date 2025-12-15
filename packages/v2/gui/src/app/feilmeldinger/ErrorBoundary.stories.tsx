import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import ErrorBoundary, { type ErrorFallbackProps } from './ErrorBoundary.js';

const meta = {
  title: 'gui/app/feilmeldinger',
  component: ErrorBoundary,
} satisfies Meta<typeof ErrorBoundary>;

export default meta;

type Story = StoryObj<typeof meta>;

const NonFailingChild = () => <p>Nothing to see here, move along.</p>;

const FailingChild = () => {
  useEffect(() => {
    throw new Error('TEST FAIL');
  }, []);
  return <p>Error boundary should be displayed instead of this</p>;
};

export const ErrorBoundaryNotTriggered: Story = {
  args: {
    errorMessageCallback: fn(),
    children: <NonFailingChild />,
  },
  play: async ({ args }) => {
    await expect(args.errorMessageCallback).toHaveBeenCalledTimes(0);
  },
};

export const ErrorBoundaryTriggered: Story = {
  args: {
    errorMessageCallback: fn(),
    children: <FailingChild />,
  },
  play: async ({ canvas, args }) => {
    await waitFor(() => expect(args.errorMessageCallback).toHaveBeenCalledOnce());
    await expect(canvas.getByRole('heading')).toHaveTextContent(
      'Det har oppstått en teknisk feil i denne behandlingen.',
    );
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
  play: async ({ canvas, args }) => {
    await waitFor(() => expect(args.errorMessageCallback).toHaveBeenCalledOnce());
    await expect(canvas.getByText('Feil:')).toBeInTheDocument();
    await expect(canvas.getByText('TEST FAIL')).toBeInTheDocument();
  },
};
