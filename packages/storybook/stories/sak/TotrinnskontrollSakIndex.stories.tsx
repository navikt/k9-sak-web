import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import TotrinnskontrollSakIndex from '@fpsak-frontend/sak-totrinnskontroll';
import { Behandling, KlageVurdering, TotrinnskontrollAksjonspunkt } from '@k9-sak-web/types';

import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import withReduxAndRouterProvider from '../../decorators/withReduxAndRouter';

import alleKodeverk from '../mocks/alleKodeverk.json';

const data = [
  {
    skjermlenkeType: 'FORMKRAV_KLAGE_NFP',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5082',
        opptjeningAktiviteter: [],
        beregningDtoer: [],
        besluttersBegrunnelse: null,
        totrinnskontrollGodkjent: null,
        vurderPaNyttArsaker: [],
        uttakPerioder: [],
        arbeidsforholdDtos: [],
      } as TotrinnskontrollAksjonspunkt,
    ],
  },
  {
    skjermlenkeType: 'BEREGNING',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5038',
        opptjeningAktiviteter: [],
        beregningDtoer: [
          {
            fastsattVarigEndringNaering: false,
            faktaOmBeregningTilfeller: null,
            skjæringstidspunkt: '2020-01-01',
          },
        ],
        besluttersBegrunnelse: null,
        totrinnskontrollGodkjent: null,
        vurderPaNyttArsaker: [],
        arbeidsforholdDtos: [],
      },
      {
        aksjonspunktKode: '5039',
        opptjeningAktiviteter: [],
        beregningDtoer: [
          {
            fastsattVarigEndringNaering: true,
            fastsattVarigEndring: true,
            faktaOmBeregningTilfeller: null,
            skjæringstidspunkt: '2020-01-01',
          },
          {
            fastsattVarigEndringNaering: false,
            fastsattVarigEndring: false,
            faktaOmBeregningTilfeller: null,
            skjæringstidspunkt: '2020-02-01',
          },
        ],
        besluttersBegrunnelse: null,
        totrinnskontrollGodkjent: null,
        vurderPaNyttArsaker: [],
        uttakPerioder: [],
        arbeidsforholdDtos: [],
      },
    ] as TotrinnskontrollAksjonspunkt[],
  },

  {
    skjermlenkeType: 'FAKTA_OM_BEREGNING',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5058',
        opptjeningAktiviteter: [],
        beregningDtoer: [
          {
            fastsattVarigEndringNaering: null,
            faktaOmBeregningTilfeller: [
              { kode: 'VURDER_LØNNSENDRING', kodeverk: 'FAKTA_OM_BEREGNING_TILFELLE' },
              { kode: 'VURDER_MOTTAR_YTELSE', kodeverk: 'FAKTA_OM_BEREGNING_TILFELLE' },
            ],
            skjæringstidspunkt: '2020-01-01',
          },
        ],
        besluttersBegrunnelse: null,
        totrinnskontrollGodkjent: null,
        vurderPaNyttArsaker: [],
        arbeidsforholdDtos: [],
      },
    ] as TotrinnskontrollAksjonspunkt[],
  },
];

const dataReadOnly = [
  {
    skjermlenkeType: 'FORMKRAV_KLAGE_NFP',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5082',
        opptjeningAktiviteter: [],
        beregningDtoer: [],
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
  key: '1',
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
    kode: behandlingType.FØRSTEGANGSSØKNAD,
    kodeverk: 'BEHANDLING_TYPE',
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
      behandlingKlageVurdering={
        {
          klageVurderingResultatNFP: {
            klageVurdering: 'STADFESTE_YTELSESVEDTAK',
          },
        } as KlageVurdering
      }
      alleKodeverk={alleKodeverk as any}
      createLocationForSkjermlenke={() => location}
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
      behandlingKlageVurdering={
        {
          klageVurderingResultatNFP: {
            klageVurdering: 'STADFESTE_YTELSESVEDTAK',
          },
        } as KlageVurdering
      }
      alleKodeverk={alleKodeverk as any}
      createLocationForSkjermlenke={() => location}
    />
  </div>
);
