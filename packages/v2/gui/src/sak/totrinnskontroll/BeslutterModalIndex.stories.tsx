import { BeslutterModalIndex } from './BeslutterModalIndex.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { TotrinnskontrollBehandling } from './types/TotrinnskontrollBehandling.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { BehandlingStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingStatus.js';
import { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';
import { expect } from 'storybook/test';

const meta = {
  title: 'gui/sak/totrinnskontroll/BeslutterModalIndex',
  component: BeslutterModalIndex,
} satisfies Meta<typeof BeslutterModalIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

const behandling: TotrinnskontrollBehandling = {
  id: 1,
  uuid: '1-1',
  versjon: 2,
  behandlingsresultatType: 'IKKE_FASTSATT',
  type: behandlingType.FØRSTEGANGSSØKNAD,
  status: BehandlingStatus.OPPRETTET,
};

export const Default: Story = {
  args: {
    behandling,
    fagsakYtelseType: FagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    erAlleAksjonspunktGodkjent: false,
    erKlageWithKA: false,
    urlEtterpå: '#etterpå',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('dialog', { name: 'Forslag til vedtak er sendt til beslutter. Du kommer nå til forsiden.' }),
    ).toBeInTheDocument();
    await expect(canvas.getByText('Vedtak returneres til saksbehandler for ny vurdering.')).toBeInTheDocument();
    await expect(canvas.getByText('Du kommer nå til forsiden.')).toBeInTheDocument();
  },
};
