import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BehandlingDtoStatus, BehandlingDtoType, BehandlingsresultatDtoType } from '@navikt/k9-sak-typescript-client';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import FatterVedtakTotrinnskontrollModalSakIndex from './FatterVedtakTotrinnskontrollModalSakIndex';

const meta: Meta<typeof FatterVedtakTotrinnskontrollModalSakIndex> = {
  title: 'gui/sak/totrinnskontroll/fatter-vedtak-modal',
  component: FatterVedtakTotrinnskontrollModalSakIndex,
} satisfies Meta<typeof FatterVedtakTotrinnskontrollModalSakIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

const behandling = {
  id: 1,
  status: BehandlingDtoStatus.FATTER_VEDTAK,
  type: BehandlingDtoType.FØRSTEGANGSSØKNAD,
  behandlingsresultat: {
    type: BehandlingsresultatDtoType.OPPHØR,
  },
  toTrinnsBehandling: false,
};

export const VisModalEtterGodkjenning: Story = {
  args: {
    behandling,
    closeEvent: action('button-click'),
    allAksjonspunktApproved: true,
    fagsakYtelseType: fagsakYtelsesType.FORELDREPENGER,
    erKlageWithKA: false,
    harSammeResultatSomOriginalBehandling: false,
  },
};

export const VisModalEtterGodkjenningAvKlage: Story = {
  args: {
    behandling: {
      ...behandling,
      type: BehandlingDtoType.FØRSTEGANGSSØKNAD,
    },
    closeEvent: action('button-click'),
    allAksjonspunktApproved: true,
    fagsakYtelseType: fagsakYtelsesType.FORELDREPENGER,
    erKlageWithKA: false,
    harSammeResultatSomOriginalBehandling: false,
  },
};

export const VisModalEtterTilbakesendingTilSaksbehandler: Story = {
  args: {
    behandling,
    closeEvent: action('button-click'),
    allAksjonspunktApproved: false,
    fagsakYtelseType: fagsakYtelsesType.FORELDREPENGER,
    erKlageWithKA: false,
    harSammeResultatSomOriginalBehandling: false,
  },
};
