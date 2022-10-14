import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VedtakKlageProsessIndex from '@fpsak-frontend/prosess-vedtak-klage';

import withReduxProvider from '../../../decorators/withRedux';

const alleKodeverk = require('../../mocks/alleKodeverk.json'); // eslint-disable-line

const behandling = {
  id: 1,
  versjon: 1,
  behandlingsresultat: {
    type: {
      kode: behandlingResultatType.KLAGE_AVVIST, // #kodeverk
    },
  },
  behandlingPaaVent: false,
};

const aksjonspunkter = [
  {
    definisjon: aksjonspunktCodes.FORESLA_VEDTAK,
    status: aksjonspunktStatus.OPPRETTET,
    begrunnelse: undefined,
  },
];

export default {
  title: 'prosess/klage/prosess-vedtak-klage',
  component: VedtakKlageProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visVedtakspanelDerKlageErVurdertAvNk = () => (
  <VedtakKlageProsessIndex
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
        avvistArsaker: ['IKKE_KONKRET'],
      },
    })}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
    isReadOnly={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
  />
);

export const visVedtakspanelDerKlageErVurdertAvNfp = () => (
  <VedtakKlageProsessIndex
    behandling={behandling}
    klageVurdering={object('klageVurdering', {
      klageVurderingResultatNK: {
        klageVurdertAv: 'NAY',
        klageVurdering: klageVurderingCodes.AVVIS_KLAGE,
        fritekstTilBrev: 'test',
        klageMedholdArsakNavn: 'TEST',
        godkjentAvMedunderskriver: false,
      },
      klageFormkravResultatKA: {
        avvistArsaker: ['IKKE_KONKRET'],
      },
    })}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
    isReadOnly={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
  />
);

export const visVedtakspanelDerKlageErVurdertAvNfpVurder5034 = () => (
  <VedtakKlageProsessIndex
    behandling={behandling}
    klageVurdering={object('klageVurdering', {
      klageVurderingResultatNK: {
        klageVurdertAv: 'NAY',
        klageVurdering: klageVurderingCodes.AVVIS_KLAGE,
        fritekstTilBrev: 'test',
        klageMedholdArsakNavn: 'TEST',
        godkjentAvMedunderskriver: false,
      },
      klageFormkravResultatKA: {
        avvistArsaker: ['IKKE_KONKRET'],
      },
    })}
    aksjonspunkter={aksjonspunkter.concat([
      {
        definisjon: aksjonspunktCodes.VURDERE_DOKUMENT,
        status: aksjonspunktStatus.OPPRETTET,
        kanLoses: true,
        begrunnelse: undefined,
      },
    ])}
    submitCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
    isReadOnly={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
  />
);
