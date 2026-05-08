import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { CrashErrorView } from './CrashErrorView.js';
import { FrontendError } from '../FrontendError.js';
import { fn } from 'storybook/test';

const meta = {
  title: 'gui/app/errorhandling/boundary/CrashErrorView',
  component: CrashErrorView,
} satisfies Meta<typeof CrashErrorView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MedEnkelError: Story = {
  args: {
    error: new Error('Noe gikk veldig galt'),
    sentryId: undefined,
    reset: fn(),
  },
};

export const MedFrontendError: Story = {
  args: {
    error: new FrontendError('Alvorleg feil i behandlinga'),
    sentryId: 'abc-123-sentry',
    reset: fn(),
  },
  play: async ({ canvas, args }) => {
    const errorId = (args.error as FrontendError).errorId;
    await expect(canvas.getByText(new RegExp(`${errorId}`))).toBeInTheDocument();
  },
};

export const MedSentryId: Story = {
  args: {
    error: new Error('Kritisk feil'),
    sentryId: 'sentry-id-xyz',
    reset: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Uventet mange feil oppsto/)).toBeInTheDocument();
    await expect(canvas.getByText(/Kritisk feil/)).toBeInTheDocument();
    await expect(canvas.getByText(/Ingen/)).toBeInTheDocument();
  },
};
