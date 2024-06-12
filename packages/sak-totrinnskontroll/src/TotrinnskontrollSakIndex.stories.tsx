import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { Behandling, KlageVurdering, TotrinnskontrollAksjonspunkt } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';
import React from 'react';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { BehandlingType } from '@k9-sak-web/lib/types/BehandlingType.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import TotrinnskontrollSakIndex from './TotrinnskontrollSakIndex';

const data = [
  {
    skjermlenkeType: 'FAKTA_OM_ARBEIDSFORHOLD',
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
              'VURDER_LØNNSENDRING', // FAKTA_OM_BEREGNING_TILFELLE
              'VURDER_MOTTAR_YTELSE', // FAKTA_OM_BEREGNING_TILFELLE
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
    skjermlenkeType: 'FAKTA_OM_VERGE',
    totrinnskontrollAksjonspunkter: [
      {
        aksjonspunktKode: '5082',
        opptjeningAktiviteter: [],
        beregningDtoer: [],
        besluttersBegrunnelse: 'asdfa',
        totrinnskontrollGodkjent: false,
        vurderPaNyttArsaker: ['FEIL_REGEL', 'FEIL_FAKTA'],
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
  status: behandlingStatus.FATTER_VEDTAK,
  type: behandlingType.FORSTEGANGSSOKNAD,
  behandlingÅrsaker: [],
  toTrinnsBehandling: true,
} as Behandling;

export default {
  title: 'sak/sak-totrinnskontroll',
  component: TotrinnskontrollSakIndex,
};

export const visTotrinnskontrollForBeslutter = props => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
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
        onSubmit={action('button-click')}
        behandlingKlageVurdering={
          {
            klageVurderingResultatNFP: {
              klageVurdering: 'STADFESTE_YTELSESVEDTAK',
            },
          } as KlageVurdering
        }
        createLocationForSkjermlenke={() => location}
        {...props}
      />
    </div>
  </KodeverkProvider>
);

visTotrinnskontrollForBeslutter.args = {
  readOnly: false,
};

export const visTotrinnskontrollForSaksbehandler = () => (
  <KodeverkProvider
    behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
    kodeverk={alleKodeverkV2}
    klageKodeverk={{}}
    tilbakeKodeverk={{}}
  >
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
          status: behandlingStatus.BEHANDLING_UTREDES,
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
        createLocationForSkjermlenke={() => location}
      />
    </div>
  </KodeverkProvider>
);
