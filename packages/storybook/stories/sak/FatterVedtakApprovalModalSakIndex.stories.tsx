import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { FatterVedtakTotrinnskontrollModalSakIndex } from '@fpsak-frontend/sak-totrinnskontroll';
import { Behandling } from '@k9-sak-web/types';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus.js';
import { behandlingType } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import withReduxProvider from '../../decorators/withRedux';

export default {
  title: 'sak/sak-totrinnskontroll-fatter-vedtak-modal',
  component: FatterVedtakTotrinnskontrollModalSakIndex,
  decorators: [withKnobs, withReduxProvider],
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
      kode: text('behandlingResultatType', behandlingResultatType.OPPHOR),
    },
  },
} as Behandling;

export const visModalEtterGodkjenning = () => (
  <FatterVedtakTotrinnskontrollModalSakIndex
    behandling={behandling}
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
      kode: text('Fagsakytelsetype', fagsakYtelseType.FORELDREPENGER),
      kodeverk: '',
    }}
    erKlageWithKA={boolean('erKlageWithKA', false)}
    harSammeResultatSomOriginalBehandling={boolean('Har samme resultat som original behandling', false)}
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
    harSammeResultatSomOriginalBehandling={boolean('Har samme resultat som original behandling', false)}
  />
);
