import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import TotrinnskontrollSakIndex from '@fpsak-frontend/sak-totrinnskontroll';

import { TilbakemeldingerFraTotrinnskontrollContainer } from '@fpsak-frontend/sak-totrinnskontroll-tilbakemeldinger';
import withReduxAndRouterProvider from '../../decorators/withReduxAndRouter';

import alleKodeverk from '../mocks/alleKodeverk.json';

const dataReadOnly = [
  {
    skjermlenkeType: 'FORMKRAV_KLAGE_NFP',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5082',
        opptjeningAktiviteter: [],
        beregningDto: {
          fastsattVarigEndringNaering: false,
          faktaOmBeregningTilfeller: null,
        },
        besluttersBegrunnelse: 'asdfa',
        totrinnskontrollGodkjent: false,
        vurderPaNyttArsaker: [
          {
            kode: 'FEIL_REGEL',
            navn: 'Feil regelforståelse',
          },
          {
            kode: 'FEIL_FAKTA',
            navn: 'Feil fakta',
          },
        ],
        uttakPerioder: [],
        arbeidforholdDtos: [],
      },
    ],
  },
];

const skjermlenkeTyper = [
  {
    kode: 'FORMKRAV_KLAGE_NFP',
  },
];

export default {
  title: 'sak/sak-totrinnskontroll-tilbakemeldinger',
  component: TotrinnskontrollSakIndex,
  decorators: [withKnobs, withReduxAndRouterProvider],
};

export const visTotrinnskontrollTilbakemeldingForSaksbehandler = () => (
  <div style={{ width: '600px', margin: '50px' }}>
    <TilbakemeldingerFraTotrinnskontrollContainer
      behandlingId={1}
      behandlingVersjon={2}
      totrinnskontrollContext={dataReadOnly}
      behandlingStatus={{
        kode: behandlingStatus.BEHANDLING_UTREDES,
      }}
      location={{}}
      readOnly
      onSubmit={action('button-click')}
      forhandsvisVedtaksbrev={action('button-click')}
      toTrinnsBehandling
      skjermlenkeTyper={skjermlenkeTyper}
      isForeldrepengerFagsak
      behandlingKlageVurdering={{
        klageVurderingResultatNFP: {
          klageVurdering: 'STADFESTE_YTELSESVEDTAK',
        },
      }}
      alleKodeverk={alleKodeverk}
      erBehandlingEtterKlage
      disableGodkjennKnapp={boolean('disableGodkjennKnapp', false)}
    />
  </div>
);
