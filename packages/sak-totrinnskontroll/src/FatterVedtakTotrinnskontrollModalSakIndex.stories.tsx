import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus.js';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { behandlingType } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { Behandling } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';
import React from 'react';
import FatterVedtakTotrinnskontrollModalSakIndex from './FatterVedtakTotrinnskontrollModalSakIndex';

export default {
  title: 'sak/sak-totrinnskontroll-fatter-vedtak-modal',
  component: FatterVedtakTotrinnskontrollModalSakIndex,
};

const behandling = {
  id: 1,
  status: {
    kode: behandlingStatus.FATTER_VEDTAK,
    kodeverk: '',
  },
  type: {
    kode: behandlingType.FØRSTEGANGSSØKNAD,
    kodeverk: 'BEHANDLING_TYPE',
  },
  behandlingsresultat: {
    type: {
      kode: behandlingResultatType.OPPHOR,
    },
  },
} as Behandling;

export const visModalEtterGodkjenning = () => (
  <FatterVedtakTotrinnskontrollModalSakIndex
    behandling={behandling}
    closeEvent={action('button-click')}
    allAksjonspunktApproved
    fagsakYtelseType={{
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: '',
    }}
    erKlageWithKA={false}
    harSammeResultatSomOriginalBehandling={false}
  />
);

export const visModalEtterGodkjenningAvKlage = () => (
  <FatterVedtakTotrinnskontrollModalSakIndex
    behandling={
      {
        ...behandling,
        type: {
          kode: behandlingType.KLAGE,
          kodeverk: 'BEHANDLING_TYPE',
        },
      } as Behandling
    }
    closeEvent={action('button-click')}
    allAksjonspunktApproved
    fagsakYtelseType={{
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: '',
    }}
    erKlageWithKA={false}
    harSammeResultatSomOriginalBehandling={false}
  />
);

export const visModalEtterTilbakesendingTilSaksbehandler = () => (
  <FatterVedtakTotrinnskontrollModalSakIndex
    behandling={behandling}
    closeEvent={action('button-click')}
    allAksjonspunktApproved={false}
    fagsakYtelseType={{
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: '',
    }}
    erKlageWithKA={false}
    harSammeResultatSomOriginalBehandling={false}
  />
);
