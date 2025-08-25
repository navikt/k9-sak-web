import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import {
  k9_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus,
  k9_kodeverk_behandling_BehandlingType as BehandlingDtoType,
  k9_kodeverk_behandling_BehandlingResultatType as BehandlingsresultatDtoType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
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
