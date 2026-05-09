import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { CrashErrorView } from './CrashErrorView.js';
import { FrontendError } from '../FrontendError.js';
import { createErrorAndId } from '../AlertInfo.js';

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
    caught: createErrorAndId(new FrontendError('Noe gikk veldig galt')),
    reset: fn(),
  },
};

export const MedFrontendError: Story = {
  args: {
    caught: createErrorAndId(new FrontendError('Alvorleg feil i behandlinga')),
    reset: fn(),
  },
  play: async ({ canvas, args }) => {
    const { errorId } = args.caught;
    await expect(canvas.getByText(new RegExp(`${errorId}`))).toBeInTheDocument();
  },
};
