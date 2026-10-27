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
    error: new AppError({ message: 'Noe gikk veldig galt' }),
    reset: fn(),
  },
};

export const MedAppError: Story = {
  args: {
    error: new AppError({ message: 'Alvorleg feil i behandlinga' }),
    reset: fn(),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Alvorleg feil i behandlinga/)).toBeInTheDocument();
  },
};
