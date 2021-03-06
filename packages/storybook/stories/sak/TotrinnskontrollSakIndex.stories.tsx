import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import TotrinnskontrollSakIndex from '@fpsak-frontend/sak-totrinnskontroll';
import { Behandling, KlageVurdering } from '@k9-sak-web/types';

import withReduxAndRouterProvider from '../../decorators/withReduxAndRouter';

import alleKodeverk from '../mocks/alleKodeverk.json';

const data = [
  {
    skjermlenkeType: 'FORMKRAV_KLAGE_NFP',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5082',
        opptjeningAktiviteter: [],
        beregningDto: {
          fastsattVarigEndringNaering: false,
          faktaOmBeregningTilfeller: null,
          skjæringstidspunkt: '2020-01-01',
        },
        besluttersBegrunnelse: null,
        totrinnskontrollGodkjent: null,
        vurderPaNyttArsaker: [],
        uttakPerioder: [],
        arbeidsforholdDtos: [],
      },
    ],
  },
];

const dataReadOnly = [
  {
    skjermlenkeType: 'FORMKRAV_KLAGE_NFP',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5082',
        opptjeningAktiviteter: [],
        beregningDto: {
          fastsattVarigEndringNaering: false,
          faktaOmBeregningTilfeller: [null],
          skjæringstidspunkt: '2020-01-01',
        },
        besluttersBegrunnelse: 'asdfa',
        totrinnskontrollGodkjent: false,
        vurderPaNyttArsaker: [
          {
            kode: 'FEIL_REGEL',
            kodeverk: '',
          },
          {
            kode: 'FEIL_FAKTA',
            kodeverk: '',
          },
        ],
        uttakPerioder: [],
        arbeidsforholdDtos: [],
      },
    ],
  },
];

const location = {
  pathname: '',
  search: '',
  state: {},
  hash: '',
};

const behandling = {
  id: 1,
  versjon: 2,
  status: {
    kode: behandlingStatus.FATTER_VEDTAK,
    kodeverk: '',
  },
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    kodeverk: '',
  },
  behandlingÅrsaker: [],
  toTrinnsBehandling: true,
} as Behandling;

export default {
  title: 'sak/sak-totrinnskontroll',
  component: TotrinnskontrollSakIndex,
  decorators: [withKnobs, withReduxAndRouterProvider],
};

export const visTotrinnskontrollForBeslutter = () => (
  <div
    style={{
      width: '600px',
      margin: '50px',
      padding: '20px',
      backgroundColor: 'white',
    }}
  >
    <TotrinnskontrollSakIndex
      behandling={behandling}
      totrinnskontrollSkjermlenkeContext={data}
      location={location}
      readOnly={boolean('readOnly', false)}
      onSubmit={action('button-click')}
      forhandsvisVedtaksbrev={action('button-click')}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: '',
      }}
      behandlingKlageVurdering={
        {
          klageVurderingResultatNFP: {
            klageVurdering: 'STADFESTE_YTELSESVEDTAK',
          },
        } as KlageVurdering
      }
      alleKodeverk={alleKodeverk as any}
      createLocationForSkjermlenke={() => location}
      tilgjengeligeVedtaksbrev={[]}
    />
  </div>
);

export const visTotrinnskontrollForSaksbehandler = () => (
  <div
    style={{
      width: '600px',
      margin: '50px',
      padding: '20px',
      backgroundColor: 'white',
    }}
  >
    <TotrinnskontrollSakIndex
      behandling={{
        ...behandling,
        status: {
          kode: behandlingStatus.BEHANDLING_UTREDES,
          kodeverk: '',
        },
      }}
      totrinnskontrollSkjermlenkeContext={dataReadOnly}
      location={location}
      readOnly
      onSubmit={action('button-click')}
      forhandsvisVedtaksbrev={action('button-click')}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        kodeverk: '',
      }}
      behandlingKlageVurdering={
        {
          klageVurderingResultatNFP: {
            klageVurdering: 'STADFESTE_YTELSESVEDTAK',
          },
        } as KlageVurdering
      }
      alleKodeverk={alleKodeverk as any}
      createLocationForSkjermlenke={() => location}
      tilgjengeligeVedtaksbrev={[]}
    />
  </div>
);
