import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import UnauthorizedPage from './UnauthorizedPage.js';

const meta = {
  title: 'gui/app/errorhandling/feilmeldinger',
  component: UnauthorizedPage,
} satisfies Meta<typeof UnauthorizedPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FeilmeldingIkkeInnlogget: Story = {
  args: {
    loginUrl: '/',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Du må logge inn for å få tilgang til systemet' }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Gå til innloggingssiden' })).toBeInTheDocument();
  },
};
