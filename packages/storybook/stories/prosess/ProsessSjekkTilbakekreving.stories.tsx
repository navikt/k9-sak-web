import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import alleKodeverk from '../mocks/alleKodeverk.json';
import withReduxProvider from '../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    kodeverk: '',
  },
  status: {
    kode: behandlingStatus.BEHANDLING_UTREDES,
    kodeverk: '',
  },
  sprakkode: {
    kode: 'NO',
    kodeverk: '',
  },
  behandlingsresultat: {
    vedtaksbrev: {
      kode: 'FRITEKST',
      kodeverk: '',
    },
    type: {
      kode: behandlingResultatType.IKKE_FASTSATT,
      kodeverk: '',
    },
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  behandlingArsaker: [
    {
      behandlingArsakType: {
        kode: klageBehandlingArsakType.ETTER_KLAGE,
        kodeverk: '',
      },
    },
  ],
};

const vilkar = [
  {
    lovReferanse: '§§Dette er en lovreferanse',
    vilkarType: {
      kode: vilkarType.SOKNADSFRISTVILKARET,
      kodeverk: kodeverkTyper.VILKAR_TYPE,
    },
    vilkarStatus: {
      kode: vilkarUtfallType.OPPFYLT,
    },
  },
];

export default {
  title: 'prosess/prosess-vedtak',
  decorators: [withKnobs, withReduxProvider],
};

export const visSjekkTilbakekreving = () => {
  const aksjonspunkt5085 = {
    aksjonspunktType: { kode: 'MANU', kodeverk: 'AKSJONSPUNKT_TYPE' },
    begrunnelse: null,
    besluttersBegrunnelse: null,
    definisjon: {
      kode: '5085',
      kodeverk: 'AKSJONSPUNKT_DEF',
    },
    erAktivt: true,
    fristTid: null,
    kanLoses: true,
    status: { kode: 'OPPR', kodeverk: 'AKSJONSPUNKT_STATUS' },
    toTrinnsBehandling: false,
    toTrinnsBehandlingGodkjent: null,
    vilkarType: null,
    vurderPaNyttArsaker: null,
    venteårsak: { kode: '-', kodeverk: 'VENT_AARSAK' },
  };

  return (
    <VedtakProsessIndex
      behandling={{
        ...behandling,
        type: {
          kode: behandlingType.SOKNAD,
          kodeverk: '',
        },
        behandlingsresultat: {
          vedtaksbrev: {
            kode: 'FRITEKST',
          },
          type: {
            kode: behandlingResultatType.IKKE_FASTSATT,
          },
        },
      }}
      vilkar={[]}
      sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
      medlemskap={{ fom: '2019-01-01' }}
      aksjonspunkter={[aksjonspunkt5085]}
      employeeHasAccess={boolean('employeeHasAccess', false)}
      isReadOnly={boolean('isReadOnly', false)}
      previewCallback={action('button-click')}
      submitCallback={action('button-click')}
      alleKodeverk={alleKodeverk}
    />
  );
};
