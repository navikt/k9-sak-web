import {
  ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus,
  ung_kodeverk_behandling_BehandlingResultatType,
  ung_kodeverk_behandling_BehandlingStatus,
  ung_kodeverk_behandling_BehandlingType,
  ung_kodeverk_behandling_FagsakYtelseType,
  ung_kodeverk_klage_KlageVurderingType,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import type { StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { asyncAction } from '../../storybook/asyncAction';
import { VedtakKlageProsessIndex } from './VedtakKlageProsessIndex';

const behandling = {
  id: 1,
  versjon: 1,
  behandlingsresultat: {
    type: ung_kodeverk_behandling_BehandlingResultatType.KLAGE_AVVIST,
  },
  behandlingPåVent: false,
  opprettet: '',
  sakstype: ung_kodeverk_behandling_FagsakYtelseType.UNGDOMSYTELSE,
  status: ung_kodeverk_behandling_BehandlingStatus.OPPRETTET,
  type: ung_kodeverk_behandling_BehandlingType.KLAGE,
  uuid: '',
};

const aksjonspunkter = [
  {
    definisjon: ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon['FORESLÅ_VEDTAK'],
    status: ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
    begrunnelse: undefined,
  },
];

const meta = {
  title: 'gui/prosess/vedtak-klage',
  component: VedtakKlageProsessIndex,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const VisVedtakspanelDerKlageErVurdertAvNk: Story = {
  args: {
    behandling,
    aksjonspunkter,
    submitCallback: asyncAction('løs aksjonspunkt'),
    klageVurdering: {
      klageVurderingResultatNK: {
        klageVurdertAv: 'NK',
        klageVurdering: ung_kodeverk_klage_KlageVurderingType.AVVIS_KLAGE,
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
  },
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
      klageVurdering: ung_kodeverk_klage_KlageVurderingType.AVVIS_KLAGE,
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
