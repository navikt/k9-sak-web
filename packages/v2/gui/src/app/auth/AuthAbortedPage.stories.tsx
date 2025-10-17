import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { AuthAbortedPage } from './AuthAbortedPage.js';

const meta = {
  title: 'gui/app/auth/AuthAbortedPage',
  component: AuthAbortedPage,
} satisfies Meta<typeof AuthAbortedPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    retryURL: null,
  },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByText('Innlogging avbrutt')).toBeVisible();
    const retryLink = canvas.getByRole('link', { name: 'Logg inn' });
    await expect(retryLink).toBeVisible();
    await expect(retryLink).toHaveAttribute('href', args.retryURL?.href ?? '/');
  },
};
