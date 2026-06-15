import type { Meta, StoryObj } from '@storybook/react-vite';
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
    await expect(canvas.getByRole('heading', { name: 'Du har ikke tilgang til denne saken' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Gå til forsiden' })).toBeInTheDocument();
  },
};

export const FeilmeldingIkkeTilgangMedÅrsaker: Story = {
  args: {
    ikkeTilgangÅrsaker: ['HAR_IKKE_TILGANG_TIL_KODE6_PERSON', 'HAR_IKKE_TILGANG_TIL_HISTORISK_SAK'],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Du har ikke tilgang til denne saken' })).toBeInTheDocument();
    await expect(
      canvas.getByText('Du mangler tilgang til saker med strengt fortrolig adresse (kode 6)'),
    ).toBeInTheDocument();
    await expect(canvas.getByText('Du mangler tilgang til historiske saker')).toBeInTheDocument();
  },
};

export const FeilmeldingFortrolig: Story = {
  args: {
    ikkeTilgangÅrsaker: ['HAR_IKKE_TILGANG_TIL_KODE7_PERSON'],
  },
};

export const FeilmeldingHistoriskSak: Story = {
  args: {
    ikkeTilgangÅrsaker: ['HAR_IKKE_TILGANG_TIL_HISTORISK_SAK'],
  },
};
