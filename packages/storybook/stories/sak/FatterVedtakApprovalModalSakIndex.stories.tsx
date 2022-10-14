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
        status: behandlingStatus.FATTER_VEDTAK,
        type: behandlingType.FORSTEGANGSSOKNAD,
        behandlingsresultat: {
          type: {
            kode: text('behandlingResultatType', behandlingResultatType.OPPHOR), // #kodeverk
          },
        },
      } as Behandling
    }
    closeEvent={action('button-click')}
    allAksjonspunktApproved
    fagsakYtelseType={text('Fagsakytelsetype', fagsakYtelseType.FORELDREPENGER)}
    erKlageWithKA={false}
    harSammeResultatSomOriginalBehandling={boolean('Har samme resultat som original behandling', false)}
  />
);

export const visModalEtterGodkjenningAvKlage = () => (
  <FatterVedtakTotrinnskontrollModalSakIndex
    behandling={
      {
        id: 1,
        status: behandlingStatus.FATTER_VEDTAK,
        type: behandlingType.KLAGE,
        behandlingsresultat: {
          type: {
            kode: text('behandlingResultatType', behandlingResultatType.OPPHOR), // #kodeverk
          },
        },
      } as Behandling
    }
    closeEvent={action('button-click')}
    allAksjonspunktApproved
    fagsakYtelseType={text('Fagsakytelsetype', fagsakYtelseType.FORELDREPENGER)}
    erKlageWithKA={boolean('erKlageWithKA', false)}
    harSammeResultatSomOriginalBehandling={boolean('Har samme resultat som original behandling', false)}
  />
);

export const visModalEtterTilbakesendingTilSaksbehandler = () => (
  <FatterVedtakTotrinnskontrollModalSakIndex
    behandling={
      {
        id: 1,
        status: behandlingStatus.FATTER_VEDTAK,
        type: behandlingType.FORSTEGANGSSOKNAD,
        behandlingsresultat: {
          type: {
            kode: text('behandlingResultatType', behandlingResultatType.OPPHOR), // #kodeverk
          },
        },
      } as Behandling
    }
    closeEvent={action('button-click')}
    allAksjonspunktApproved={false}
    fagsakYtelseType={fagsakYtelseType.FORELDREPENGER}
    erKlageWithKA={false}
    harSammeResultatSomOriginalBehandling={boolean('Har samme resultat som original behandling', false)}
  />
);
