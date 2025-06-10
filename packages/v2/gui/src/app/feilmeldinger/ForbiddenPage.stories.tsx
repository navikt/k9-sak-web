import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import ForbiddenPage from './ForbiddenPage.js';

const meta = {
  title: 'gui/app/feilmeldinger',
  component: ForbiddenPage,
} satisfies Meta<typeof ForbiddenPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FeilmeldingIkkeTilgang: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Du har ikke tilgang til å slå opp denne personen' }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Gå til forsiden' })).toBeInTheDocument();
  },
};
