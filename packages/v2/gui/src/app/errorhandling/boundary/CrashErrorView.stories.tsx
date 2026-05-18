import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { CrashErrorView } from './CrashErrorView.js';
import { AppError } from '../AppError.js';

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
    error: new AppError('Noe gikk veldig galt'),
    reset: fn(),
  },
};

const medAppErrorInstance = new AppError('Alvorleg feil i behandlinga');

export const MedAppError: Story = {
  args: {
    error: medAppErrorInstance,
    reset: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(new RegExp(`${medAppErrorInstance.errorId}`))).toBeInTheDocument();
  },
};
