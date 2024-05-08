import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import FormkravProsessIndex from '@fpsak-frontend/prosess-formkrav';
import { action } from '@storybook/addon-actions';
import React from 'react';

import withReduxProvider from '../../../decorators/withRedux';

import alleKodeverk from '../../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: {
    kode: 'NO',
  },
};

const avsluttedeBehandlinger = [
  {
    id: 1,
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
    },
    avsluttet: '2017-08-02T00:54:25.455',
  },
];

const fagsak = {
  sakstype: {
    kode: fagsakYtelseType.PLEIEPENGER,
    kodeverk: '',
  },
};

export default {
  title: 'prosess/klage/prosess-formkrav',
  component: FormkravProsessIndex,
  decorators: [withReduxProvider],
};

export const visFormkravPanelForAksjonspunktNfp = args => (
  <FormkravProsessIndex
    behandling={behandling}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
    avsluttedeBehandlinger={avsluttedeBehandlinger}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP,
        },
      },
    ]}
    fagsak={fagsak}
    {...args}
  />
);

visFormkravPanelForAksjonspunktNfp.args = {
  klageVurdering: {
    klageVurderingResultatNK: {
      klageVurdertAv: 'NK',
      klageVurdering: klageVurderingCodes.AVVIS_KLAGE,
      fritekstTilBrev: 'test',
      klageMedholdArsakNavn: 'TEST',
      godkjentAvMedunderskriver: false,
    },
    klageFormkravResultatKA: {
      avvistArsaker: [
        {
          navn: 'Denne er avvist fordi...',
        },
      ],
    },
  },
  isReadOnly: false,
  readOnlySubmitButton: false,
};

export const visFormkravPanelForAksjonspunktKa = args => (
  <FormkravProsessIndex
    behandling={behandling}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
    avsluttedeBehandlinger={avsluttedeBehandlinger}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA,
        },
      },
    ]}
    fagsak={fagsak}
    {...args}
  />
);

visFormkravPanelForAksjonspunktKa.args = {
  klageVurdering: {
    klageVurderingResultatNK: {
      klageVurdertAv: 'NK',
      klageVurdering: klageVurderingCodes.AVVIS_KLAGE,
      fritekstTilBrev: 'test',
      klageMedholdArsakNavn: 'TEST',
      godkjentAvMedunderskriver: false,
    },
    klageFormkravResultatKA: {
      avvistArsaker: [
        {
          navn: 'Denne er avvist fordi...',
        },
      ],
    },
  },
  isReadOnly: false,
  readOnlySubmitButton: false,
};
