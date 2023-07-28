import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import withReduxProvider from '../../decorators/withRedux';
import alleKodeverk from '../mocks/alleKodeverk.json';

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
            kodeverk: '',
          },
          type: {
            kode: behandlingResultatType.IKKE_FASTSATT,
            kodeverk: '',
          },
        },
        behandlingÅrsaker: [],
      }}
      vilkar={[]}
      medlemskap={{ fom: '2019-01-01' }}
      aksjonspunkter={[aksjonspunkt5085]}
      employeeHasAccess={boolean('employeeHasAccess', false)}
      isReadOnly={boolean('isReadOnly', false)}
      previewCallback={action('button-click')}
      submitCallback={action('button-click')}
      // @ts-ignore
      alleKodeverk={alleKodeverk}
    />
  );
};
