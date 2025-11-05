import type { k9_klage_kontrakt_klage_KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import {
  ung_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon,
  ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus,
  ung_kodeverk_behandling_BehandlingResultatType,
  ung_kodeverk_behandling_BehandlingStatus,
  ung_kodeverk_behandling_BehandlingType,
  ung_kodeverk_behandling_FagsakYtelseType,
  ung_kodeverk_klage_KlageAvvistÅrsak,
  ung_kodeverk_klage_KlageVurderingType,
  type ung_sak_kontrakt_klage_KlagebehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { FakeVedtakKlageBackendApi } from '@k9-sak-web/gui/storybook/mocks/FakeVedtakKlageBackendApi.js';
import alleKodeverkKlageV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkKlageV2.json';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { asyncAction } from '../../storybook/asyncAction';
import { VedtakKlageApiContext } from './api/VedtakKlageApiContext';
import { VedtakKlageProsessIndex } from './VedtakKlageProsessIndex';

export const withFakeVedtakKlageApi =
  (klageVurdering: ung_sak_kontrakt_klage_KlagebehandlingDto | k9_klage_kontrakt_klage_KlagebehandlingDto): Decorator =>
  Story => {
    const fakeVedtakKlageBackendApi = new FakeVedtakKlageBackendApi(klageVurdering);
    return (
      <VedtakKlageApiContext value={fakeVedtakKlageBackendApi}>
        <Story />
      </VedtakKlageApiContext>
    );
  };

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
  render: props => (
    <KodeverkProvider
      behandlingType={ung_kodeverk_behandling_BehandlingType.KLAGE}
      kodeverk={alleKodeverkV2}
      klageKodeverk={alleKodeverkKlageV2}
      tilbakeKodeverk={{}}
    >
      <VedtakKlageProsessIndex {...props} />
    </KodeverkProvider>
  ),
} satisfies Meta<typeof VedtakKlageProsessIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisVedtakspanelDerKlageErVurdertAvNk: Story = {
  args: {
    behandling: behandling,
    aksjonspunkter,
    submitCallback: asyncAction('løs aksjonspunkt'),
    isReadOnly: false,
  },
  decorators: withFakeVedtakKlageApi({
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
  }),
};
