import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { action } from '@storybook/addon-actions';
import React from 'react';
// eslint-disable-next-line import/no-relative-packages
import alleKodeverk from '../../storybook/stories/mocks/alleKodeverk.json';
import VedtakKlageProsessIndex from './VedtakKlageProsessIndex';

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
};

export const visVedtakspanelDerKlageErVurdertAvNk = args => (
  <VedtakKlageProsessIndex
    behandling={behandling}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
    {...args}
  />
);

visVedtakspanelDerKlageErVurdertAvNk.args = {
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
          kode: 'IKKE_KONKRET',
          kodeverk: 'KLAGE_AVVIST_AARSAK',
        },
      ],
    },
  },
  isReadOnly: false,
};

export const visVedtakspanelDerKlageErVurdertAvNfp = args => (
  <VedtakKlageProsessIndex
    behandling={behandling}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
    {...args}
  />
);

visVedtakspanelDerKlageErVurdertAvNfp.args = {
  klageVurdering: {
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
  },
  isReadOnly: false,
};

export const visVedtakspanelDerKlageErVurdertAvNfpVurder5034 = args => (
  <VedtakKlageProsessIndex
    behandling={behandling}
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
    alleKodeverk={alleKodeverk}
    {...args}
  />
);

visVedtakspanelDerKlageErVurdertAvNfpVurder5034.args = {
  klageVurdering: {
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
  },
  isReadOnly: false,
};
