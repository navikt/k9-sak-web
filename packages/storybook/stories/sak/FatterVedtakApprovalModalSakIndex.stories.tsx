import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { FatterVedtakTotrinnskontrollModalSakIndex } from '@fpsak-frontend/sak-totrinnskontroll';
import { Behandling } from '@k9-sak-web/types';

import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'sak/sak-totrinnskontroll-fatter-vedtak-modal',
  component: FatterVedtakTotrinnskontrollModalSakIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visModalEtterGodkjenning = () => (
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
          type: behandlingResultatType.OPPHOR,
        },
      } as Behandling
    }
    closeEvent={action('button-click')}
    allAksjonspunktApproved
    fagsakYtelseType={{
      kode: text('Fagsakytelsetype', fagsakYtelseType.FORELDREPENGER),
      kodeverk: '',
    }}
    erKlageWithKA={false}
    harSammeResultatSomOriginalBehandling={boolean('Har samme resultat som original behandling', false)}
  />
);

export const visModalEtterGodkjenningAvKlage = () => (
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
          type: behandlingResultatType.OPPHOR),
        },
      } as Behandling
    }
    closeEvent={action('button-click')}
    allAksjonspunktApproved
    fagsakYtelseType={{
      kode: text('Fagsakytelsetype', fagsakYtelseType.FORELDREPENGER),
      kodeverk: '',
    }}
    erKlageWithKA={boolean('erKlageWithKA', false)}
    harSammeResultatSomOriginalBehandling={boolean('Har samme resultat som original behandling', false)}
  />
);

export const visModalEtterTilbakesendingTilSaksbehandler = () => (
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
          type: behandlingResultatType.OPPHOR),
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
    harSammeResultatSomOriginalBehandling={boolean('Har samme resultat som original behandling', false)}
  />
);
