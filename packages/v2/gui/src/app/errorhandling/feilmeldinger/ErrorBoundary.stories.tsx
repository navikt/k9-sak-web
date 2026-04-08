import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
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

const FailingChild = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count > 0) {
      throw new Error('TEST FAIL');
    }
  }, [count]);

  return (
    <button type="button" onClick={() => setCount(c => c + 1)}>
      Fail ({count + 1})
    </button>
  );
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
    children: <AlwaysFailingChild />,
  },
  play: async ({ canvas, args }) => {
    await waitFor(() => expect(args.errorMessageCallback).toHaveBeenCalledOnce());
    await expect(canvas.getByRole('heading')).toHaveTextContent(
      'Det har oppstått en teknisk feil i denne behandlingen.',
    );
  },
};

export const ErrorBoundaryTriggeredKeepChildren: Story = {
  args: {
    errorMessageCallback: fn(),
    doNotShowErrorPage: true,
    children: <FailingChild />,
  },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button'));
    await waitFor(() => expect(args.errorMessageCallback).toHaveBeenCalledOnce());
    await expect(canvas.getByRole('button')).toHaveTextContent('Fail (1)');
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
