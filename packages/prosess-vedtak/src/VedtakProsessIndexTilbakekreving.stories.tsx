import { action } from '@storybook/addon-actions';
import React from 'react';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
// eslint-disable-next-line import/no-relative-packages
import alleKodeverk from '../../storybook/stories/mocks/alleKodeverk.json';
import VedtakProsessIndex from './VedtakProsessIndex';

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
};

export const visSjekkTilbakekreving = args => {
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
      medlemskap={{ fom: '2019-01-01' }}
      aksjonspunkter={[aksjonspunkt5085]}
      previewCallback={action('button-click')}
      submitCallback={action('button-click')}
      alleKodeverk={alleKodeverk}
      {...args}
    />
  );
};

visSjekkTilbakekreving.args = {
  sendVarselOmRevurdering: false,
  employeeHasAccess: false,
  isReadOnly: false,
};
