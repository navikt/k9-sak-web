import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingOperasjonerDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingOperasjonerDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fakeAktivitetspengerApi } from '../../storybook/mocks/FakeAktivitetspengerApi.js';
import { AktivitetspengerOpphør } from './AktivitetspengerOpphør.js';

const lagAksjonspunkt = (
  definisjon: AksjonspunktDto['definisjon'],
  status: AksjonspunktDto['status'] = AksjonspunktStatus.OPPRETTET,
): AksjonspunktDto => ({
  definisjon,
  status,
  kanLoses: status === AksjonspunktStatus.OPPRETTET,
  erAktivt: status === AksjonspunktStatus.OPPRETTET,
});

const fakeBehandling = {
  uuid: 'fake-behandling-uuid',
  versjon: 1,
} as BehandlingDto;

const fakeInnloggetBruker = {
  aktivitetspengerDel1SaksbehandlerTilgang: {
    kanSaksbehandle: true,
    kanBeslutte: false,
  },
} satisfies InnloggetAnsattUngV2Dto;

const fakeLovligeBehandlingsoperasjoner = {
  uuid: 'fake-behandling-uuid',
  behandlingTilGodkjenningVedLokalkontor: false,
} satisfies BehandlingOperasjonerDto;

const fakeOpphørVilkår = {
  perioder: [
    {
      periode: {
        fom: '2026-01-01',
        tom: '2026-12-31',
      },
      vilkarStatus: Utfall.IKKE_OPPFYLT,
      begrunnelse: '',
    },
  ],
} as unknown as VilkårMedPerioderDto;

const meta = {
  title: 'gui/prosess/aktivitetspenger-opphør/AktivitetspengerOpphør',
  component: AktivitetspengerOpphør,
} satisfies Meta<typeof AktivitetspengerOpphør>;
export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST)],
    innloggetBruker: fakeInnloggetBruker,
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: () => undefined,
    vilkår: [fakeOpphørVilkår],
    totrinnskontrollSkjermlenkeContext: [] satisfies TotrinnskontrollSkjermlenkeContextDto[],
    lovligeBehandlingsoperasjoner: fakeLovligeBehandlingsoperasjoner,
  },
};
