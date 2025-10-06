import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import {
  k9_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus,
  k9_kodeverk_behandling_BehandlingType as BehandlingDtoType,
  k9_kodeverk_behandling_BehandlingResultatType as BehandlingsresultatDtoType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import FatterVedtakApprovalModal from './FatterVedtakApprovalModal.js';
import type { TotrinnskontrollBehandling } from '../../types/TotrinnskontrollBehandling.js';

const meta: Meta<typeof FatterVedtakApprovalModal> = {
  title: 'gui/sak/totrinnskontroll/modal',
  component: FatterVedtakApprovalModal,
} satisfies Meta<typeof FatterVedtakApprovalModal>;

export default meta;

type Story = StoryObj<typeof meta>;

const behandling: TotrinnskontrollBehandling = {
  id: 1,
  uuid: '1-1',
  versjon: 2,
  status: BehandlingDtoStatus.FATTER_VEDTAK,
  type: BehandlingDtoType.FØRSTEGANGSSØKNAD,
  behandlingsresultatType: BehandlingsresultatDtoType.OPPHØR,
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
