import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import NotFoundPage from './NotFoundPage.js';

const meta = {
  title: 'gui/app/feilmeldinger',
  component: NotFoundPage,
} satisfies Meta<typeof NotFoundPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FeilmeldingIkkeFunnet: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Beklager, vi finner ikke siden du leter etter.' }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Gå til forsiden' })).toBeInTheDocument();
  },
};
