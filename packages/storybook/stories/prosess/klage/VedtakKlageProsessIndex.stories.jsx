import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import behandlingResultatType from '@k9-sak-web/kodeverk/src/behandlingResultatType';
import klageVurderingCodes from '@k9-sak-web/kodeverk/src/klageVurdering';
import VedtakKlageProsessIndex from '@k9-sak-web/prosess-vedtak-klage';
import withReduxProvider from '../../../decorators/withRedux';
import alleKodeverk from '../../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
  behandlingsresultat: {
    type: {
      kode: behandlingResultatType.KLAGE_AVVIST,
    },
  },
  behandlingPaaVent: false,
};

const aksjonspunkter = [
  {
    definisjon: {
      kode: aksjonspunktCodes.FORESLA_VEDTAK,
    },
    status: {
      kode: aksjonspunktStatus.OPPRETTET,
    },
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
        avvistArsaker: [
          {
            kode: 'IKKE_KONKRET',
            kodeverk: 'KLAGE_AVVIST_AARSAK',
          },
        ],
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
        avvistArsaker: [
          {
            kode: 'IKKE_KONKRET',
            kodeverk: 'KLAGE_AVVIST_AARSAK',
          },
        ],
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
        avvistArsaker: [
          {
            kode: 'IKKE_KONKRET',
            kodeverk: 'KLAGE_AVVIST_AARSAK',
          },
        ],
      },
    })}
    aksjonspunkter={aksjonspunkter.concat([
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDERE_DOKUMENT,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
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
