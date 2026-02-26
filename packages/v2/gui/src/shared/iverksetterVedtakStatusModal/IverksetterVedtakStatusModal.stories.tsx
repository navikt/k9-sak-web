import { k9_kodeverk_behandling_BehandlingResultatType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { IverksetterVedtakStatusModal } from './IverksetterVedtakStatusModal';

const meta: Meta<typeof IverksetterVedtakStatusModal> = {
  title: 'gui/shared/iverksetterVedtakStatusModal/IverksetterVedtakStatusModal',
  component: IverksetterVedtakStatusModal,
  args: {
    visModal: true,
    lukkModal: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof IverksetterVedtakStatusModal>;

export const Innvilget: Story = {
  args: {
    behandlingsresultat: {
      type: k9_kodeverk_behandling_BehandlingResultatType.INNVILGET,
    },
  },
};

export const Avslått: Story = {
  args: {
    behandlingsresultat: {
      type: k9_kodeverk_behandling_BehandlingResultatType.AVSLÅTT,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('dialog', { name: 'Avslått' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  },
};
