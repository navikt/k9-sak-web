import {
  ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus,
  ung_kodeverk_behandling_BehandlingResultatType,
  ung_kodeverk_behandling_BehandlingStatus,
  ung_kodeverk_behandling_BehandlingType,
  ung_kodeverk_behandling_FagsakYtelseType,
  ung_kodeverk_klage_KlageAvvistÅrsak,
  ung_kodeverk_klage_KlageVurderingType,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkKlageV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkKlageV2.json';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import type { Meta, StoryObj } from '@storybook/react';
import { asyncAction } from '../../storybook/asyncAction';
import { VedtakKlageForm } from './components/VedtakKlageForm';

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
  title: 'gui/prosess/vedtak-klage/VedtakKlageForm',
  component: VedtakKlageForm,
  render: props => (
    <KodeverkProvider
      behandlingType={ung_kodeverk_behandling_BehandlingType.KLAGE}
      kodeverk={alleKodeverkV2}
      klageKodeverk={alleKodeverkKlageV2}
      tilbakeKodeverk={{}}
    >
      <VedtakKlageForm {...props} />
    </KodeverkProvider>
  ),
} satisfies Meta<typeof VedtakKlageForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisVedtakspanelDerKlageErVurdertAvNk: Story = {
  args: {
    behandlingsresultat: behandling.behandlingsresultat,
    aksjonspunkter,
    submitCallback: asyncAction('løs aksjonspunkt'),
    previewVedtakCallback: asyncAction('forhåndsvis vedtak'),
    behandlingPåVent: false,
    klageVurdering: {
      klageVurderingResultatNK: {
        klageVurdertAv: 'NK',
        klageVurdering: ung_kodeverk_klage_KlageVurderingType.AVVIS_KLAGE,
        fritekstTilBrev: 'test',
        klageMedholdArsakNavn: 'TEST',
        godkjentAvMedunderskriver: false,
      },
      klageFormkravResultatKA: {
        avvistArsaker: [ung_kodeverk_klage_KlageAvvistÅrsak.IKKE_KONKRET],
      },
    },
    readOnly: false,
  },
};
