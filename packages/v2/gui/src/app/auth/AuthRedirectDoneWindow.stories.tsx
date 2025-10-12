import { AuthRedirectDoneWindow } from './AuthRedirectDoneWindow.js';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect, fn, userEvent } from 'storybook/test';

const meta = {
  title: 'gui/app/auth/AuthRedirectDoneWindow',
  component: AuthRedirectDoneWindow,
} satisfies Meta<typeof AuthRedirectDoneWindow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sendAuthDoneMessage: fn(() => {
      action('sendAuthDoneMessage')(true);
      return true;
    }),
    waitForCloseMillis: 2_000, // Lang tid så vi kan sjå kva som skjer i story
  },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText('Vellykket innlogging')).toBeVisible();
    await expect(args.sendAuthDoneMessage).toHaveBeenCalled();
  },
};

export const NårSendMessageFeiler: Story = {
  args: {
    sendAuthDoneMessage: fn(() => {
      action('sendAuthDoneMessage')(false);
      return false;
    }),
    waitForCloseMillis: 2_000, // Lang tid så vi kan sjå kva som skjer i story
  },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText('Vellykket innlogging')).toBeVisible();
    await expect(canvas.getByText('Innlogging fullført, men', { exact: false })).toBeVisible();
    const btn = await canvas.getByRole('button', { name: 'Lukk dette vinduet' });
    await expect(btn).toBeVisible();
    await userEvent.click(btn);
    await expect(args.sendAuthDoneMessage).toHaveBeenCalledTimes(2);
  },
};
