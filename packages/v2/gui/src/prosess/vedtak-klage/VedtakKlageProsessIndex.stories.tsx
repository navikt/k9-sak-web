import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import { AksjonspunktDtoStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDtoStatus.js';
import { BehandlingResultatType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingResultatType.js';
import { BehandlingStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingStatus.js';
import { BehandlingType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';
import { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';
import { KlageAvvistÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/klage/KlageAvvistÅrsak.js';
import { KlageVurdering } from '@k9-sak-web/backend/k9klage/kodeverk/vedtak/KlageVurdering.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { FakeVedtakKlageBackendApi } from '@k9-sak-web/gui/storybook/mocks/FakeVedtakKlageBackendApi.js';
import alleKodeverkKlageV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkKlageV2.json';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { asyncAction } from '../../storybook/asyncAction';
import { VedtakKlageApiContext } from './api/VedtakKlageApiContext';
import { VedtakKlageProsessIndex } from './VedtakKlageProsessIndex';

const withFakeVedtakKlageApi =
  (klageVurdering: KlagebehandlingDto): Decorator =>
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
    type: BehandlingResultatType.KLAGE_AVVIST,
  },
  behandlingPåVent: false,
  opprettet: '',
  sakstype: FagsakYtelseType.UNGDOMSYTELSE,
  status: BehandlingStatus.OPPRETTET,
  type: BehandlingType.KLAGE,
  uuid: '',
};

const aksjonspunkter = [
  {
    definisjon: aksjonspunktCodes['FORESLÅ_VEDTAK'],
    status: AksjonspunktDtoStatus.OPPRETTET,
    begrunnelse: undefined,
  },
];

const meta = {
  title: 'gui/prosess/vedtak-klage',
  component: VedtakKlageProsessIndex,
  render: props => (
    <KodeverkProvider
      behandlingType={BehandlingType.KLAGE}
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
    fagsak: {
      saksnummer: '123',
      sakstype: FagsakYtelseType.UNGDOMSYTELSE,
    },
  },
  decorators: withFakeVedtakKlageApi({
    klageVurderingResultatNK: {
      klageVurdertAv: 'NK',
      klageVurdering: KlageVurdering.AVVIS_KLAGE,
      fritekstTilBrev: 'test',
      klageMedholdArsakNavn: 'TEST',
      godkjentAvMedunderskriver: false,
    },
    klageFormkravResultatKA: {
      avvistArsaker: [KlageAvvistÅrsak.IKKE_KONKRET],
    },
  }),
};
