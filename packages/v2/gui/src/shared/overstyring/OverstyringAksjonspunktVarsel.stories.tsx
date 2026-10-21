import { aksjonspunktStatus, type AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aksjonspunktType, type AksjonspunktType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktType.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import OverstyringAksjonspunktVarsel from './OverstyringAksjonspunktVarsel.js';

const lagAksjonspunkt = (status: AksjonspunktStatus, type: AksjonspunktType = aksjonspunktType.OVERSTYRING) => ({
  status,
  aksjonspunktType: type,
});

const meta = {
  title: 'gui/shared/overstyring/OverstyringAksjonspunktVarsel',
  component: OverstyringAksjonspunktVarsel,
  args: {
    overstyrtHva: 'uttaksgrad og utbetalingsgrad',
    erOverstyrer: false,
  },
} satisfies Meta<typeof OverstyringAksjonspunktVarsel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UløstAksjonspunkt: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(aksjonspunktStatus.OPPRETTET)],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/^Overstyring av .* må vurderes\.$/)).toBeInTheDocument();
    await expect(canvas.getByText(/Bare en saksbehandler med overstyrerrolle kan vurdere den/)).toBeInTheDocument();
  },
};

export const UtførtAksjonspunkt: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(aksjonspunktStatus.UTFØRT)],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/^Overstyring av .* er utført\.$/)).toBeInTheDocument();
    await expect(canvas.getByText(/Bare en saksbehandler med overstyrerrolle kan endre den/)).toBeInTheDocument();
  },
};
