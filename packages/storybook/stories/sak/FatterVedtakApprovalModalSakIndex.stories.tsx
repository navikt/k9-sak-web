import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import behandlingResultatType from '@k9-sak-web/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import { FatterVedtakTotrinnskontrollModalSakIndex } from '@k9-sak-web/sak-totrinnskontroll';
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
          type: {
            kode: text('behandlingResultatType', behandlingResultatType.OPPHOR),
          },
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
          type: {
            kode: text('behandlingResultatType', behandlingResultatType.OPPHOR),
          },
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
          type: {
            kode: text('behandlingResultatType', behandlingResultatType.OPPHOR),
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
    harSammeResultatSomOriginalBehandling={boolean('Har samme resultat som original behandling', false)}
  />
);
