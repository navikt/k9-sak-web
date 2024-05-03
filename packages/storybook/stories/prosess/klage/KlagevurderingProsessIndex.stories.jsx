import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import klageVurderingCodes from '@k9-sak-web/kodeverk/src/klageVurdering';
import KlagevurderingProsessIndex from '@k9-sak-web/prosess-klagevurdering';

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
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForKlagevurderingMedAksjonspunktNk = () => (
  <KlagevurderingProsessIndex
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
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.BEHANDLE_KLAGE_NK,
        },
      },
    ]}
    saveKlage={action('button-click')}
    submitCallback={action('button-click')}
    isReadOnly={boolean('readOnly', false)}
    previewCallback={action('button-click')}
    readOnlySubmitButton={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
  />
);

export const visPanelForKlagevurderingMedAksjonspunktNfp = () => (
  <KlagevurderingProsessIndex
    behandling={behandling}
    // fagsak={{ sakstype: { kode: fagsakYtelseType.OMSORGSPENGER } }}
    fagsak={{ sakstype: { kode: fagsakYtelseType.PLEIEPENGER } }}
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
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCodes.BEHANDLE_KLAGE_NFP,
        },
      },
    ]}
    saveKlage={action('button-click')}
    submitCallback={action('button-click')}
    isReadOnly={boolean('readOnly', false)}
    previewCallback={action('button-click')}
    readOnlySubmitButton={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
  />
);
