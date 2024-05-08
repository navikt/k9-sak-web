import { action } from '@storybook/addon-actions';
import React from 'react';

import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { FatterVedtakTotrinnskontrollModalSakIndex } from '@fpsak-frontend/sak-totrinnskontroll';
import { Behandling } from '@k9-sak-web/types';

import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'sak/sak-totrinnskontroll-fatter-vedtak-modal',
  component: FatterVedtakTotrinnskontrollModalSakIndex,
  decorators: [withReduxProvider],
};

export const visModalEtterGodkjenning = props => (
  <FatterVedtakTotrinnskontrollModalSakIndex
    behandling={
      {
        id: 1,
        status: {
          kode: behandlingStatus.FATTER_VEDTAK,
          kodeverk: '',
        },
        type: {
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        },
        behandlingsresultat: {
          type: {
            kode: behandlingResultatType.OPPHOR,
          },
        },
      } as Behandling
    }
    closeEvent={action('button-click')}
    allAksjonspunktApproved
    erKlageWithKA={false}
    {...props}
  />
);

visModalEtterGodkjenning.args = {
  fagsakYtelseType: { kode: fagsakYtelseType.FORELDREPENGER, kodeverk: '' },
  harSammeResultatSomOriginalBehandling: false,
};

export const visModalEtterGodkjenningAvKlage = props => (
  <FatterVedtakTotrinnskontrollModalSakIndex
    behandling={
      {
        id: 1,
        status: {
          kode: behandlingStatus.FATTER_VEDTAK,
          kodeverk: '',
        },
        type: {
          kode: behandlingType.KLAGE,
          kodeverk: '',
        },
        behandlingsresultat: {
          type: {
            kode: behandlingResultatType.OPPHOR,
          },
        },
      } as Behandling
    }
    closeEvent={action('button-click')}
    allAksjonspunktApproved
    {...props}
  />
);

visModalEtterGodkjenningAvKlage.args = {
  fagsakYtelseType: { kode: fagsakYtelseType.FORELDREPENGER, kodeverk: '' },
  erKlageWithKA: false,
  harSammeResultatSomOriginalBehandling: false,
};

export const visModalEtterTilbakesendingTilSaksbehandler = props => (
  <FatterVedtakTotrinnskontrollModalSakIndex
    behandling={
      {
        id: 1,
        status: {
          kode: behandlingStatus.FATTER_VEDTAK,
          kodeverk: '',
        },
        type: {
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        },
        behandlingsresultat: {
          type: {
            kode: behandlingResultatType.OPPHOR,
          },
        },
      } as Behandling
    }
    closeEvent={action('button-click')}
    allAksjonspunktApproved={false}
    fagsakYtelseType={{
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: '',
    }}
    erKlageWithKA={false}
    {...props}
  />
);

visModalEtterTilbakesendingTilSaksbehandler.args = { harSammeResultatSomOriginalBehandling: false };
