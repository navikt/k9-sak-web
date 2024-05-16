import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import KlagevurderingProsessIndex from '@fpsak-frontend/prosess-klagevurdering';

import withReduxProvider from '../../../decorators/withRedux';

import alleKodeverk from '../../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: {
    kode: 'NO',
  },
};

export default {
  title: 'prosess/klage/prosess-klagevurdering',
  component: KlagevurderingProsessIndex,
  decorators: [withReduxProvider],
};

export const visPanelForKlagevurderingMedAksjonspunktNk = args => (
  <KlagevurderingProsessIndex
    behandling={behandling}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.BEHANDLE_KLAGE_NK,
        },
      },
    ]}
    saveKlage={action('button-click')}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
    {...args}
  />
);

visPanelForKlagevurderingMedAksjonspunktNk.args = {
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

export const visPanelForKlagevurderingMedAksjonspunktNfp = args => (
  <KlagevurderingProsessIndex
    behandling={behandling}
    // fagsak={{ sakstype: { kode: fagsakYtelseType.OMSORGSPENGER } }}
    fagsak={{ sakstype: { kode: fagsakYtelseType.PLEIEPENGER } }}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.BEHANDLE_KLAGE_NFP,
        },
      },
    ]}
    saveKlage={action('button-click')}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
    {...args}
  />
);

visPanelForKlagevurderingMedAksjonspunktNfp.args = {
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
