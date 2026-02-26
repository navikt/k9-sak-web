import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { FatterVedtakStatusModal } from './FatterVedtakStatusModal';

const meta: Meta<typeof FatterVedtakStatusModal> = {
  title: 'gui/shared/fatterVedtakStatusModal/FatterVedtakStatusModal',
  component: FatterVedtakStatusModal,
  args: {
    visModal: true,
    tekst: 'Behandlingen er sendt til godkjenning.',
    lukkModal: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof FatterVedtakStatusModal>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('dialog', { name: 'Forslag til vedtak er sendt til beslutter.' }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  },
};
