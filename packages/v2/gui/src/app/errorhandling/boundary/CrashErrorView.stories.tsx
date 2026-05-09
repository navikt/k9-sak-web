import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { CrashErrorView } from './CrashErrorView.js';
import { FrontendError } from '../FrontendError.js';

const meta = {
  title: 'gui/app/errorhandling/boundary/CrashErrorView',
  component: CrashErrorView,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CrashErrorView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MedEnkelError: Story = {
  args: {
    error: new FrontendError('Noe gikk veldig galt'),
    reset: fn(),
  },
};

const medFrontendErrorInstance = new FrontendError('Alvorleg feil i behandlinga');

export const MedFrontendError: Story = {
  args: {
    error: medFrontendErrorInstance,
    reset: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(new RegExp(`${medFrontendErrorInstance.errorId}`))).toBeInTheDocument();
  },
};
