import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import klageVurderingCodes from '@k9-sak-web/kodeverk/src/klageVurdering';
import FormkravProsessIndex from '@k9-sak-web/prosess-formkrav';
import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
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
  decorators: [withKnobs, withReduxProvider],
};

export const visFormkravPanelForAksjonspunktNfp = () => (
  <FormkravProsessIndex
    behandling={behandling}
    klageVurdering={object('klageVurdering', {
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
    })}
    submitCallback={action('button-click')}
    isReadOnly={boolean('readOnly', false)}
    readOnlySubmitButton={boolean('readOnly', false)}
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
  />
);

export const visFormkravPanelForAksjonspunktKa = () => (
  <FormkravProsessIndex
    behandling={behandling}
    klageVurdering={object('klageVurdering', {
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
    })}
    submitCallback={action('button-click')}
    isReadOnly={boolean('readOnly', false)}
    readOnlySubmitButton={boolean('readOnly', false)}
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
  />
);
