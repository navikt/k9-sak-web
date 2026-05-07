import { ung_kodeverk_vilkår_VilkårType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { BostedAksjonspunktKode } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { UngSakVilkårMedPerioderDto } from '@k9-sak-web/backend/combined/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { FakeAktivitetspengerApi } from '@k9-sak-web/gui/storybook/mocks/FakeAktivitetspengerApi.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BosattITrondheim } from './BosattITrondheim.js';

const fakeBehandling = {
  uuid: 'fake-uuid',
  versjon: 1,
} as unknown as BehandlingDto;

const bostedsvilkår: UngSakVilkårMedPerioderDto = {
  vilkarType: ung_kodeverk_vilkår_VilkårType.BOSTEDSVILKÅR,
  perioder: [
    { periode: { fom: '2024-01-01', tom: '2024-06-30' }, vilkarStatus: Utfall.IKKE_VURDERT },
    { periode: { fom: '2024-07-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT },
  ],
} as UngSakVilkårMedPerioderDto;

const lagAksjonspunkt = (kode: string, status: AksjonspunktDto['status'] = AksjonspunktStatus.OPPRETTET): AksjonspunktDto => ({
  definisjon: kode as AksjonspunktDto['definisjon'],
  status,
  kanLoses: status === AksjonspunktStatus.OPPRETTET,
  erAktivt: status === AksjonspunktStatus.OPPRETTET,
});

const fakeApi = new FakeAktivitetspengerApi();

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/BosattITrondheim',
  component: BosattITrondheim,
  args: {
    behandling: fakeBehandling,
    vilkår: bostedsvilkår,
    kanSaksbehandle: true,
    api: fakeApi,
    onAksjonspunktBekreftet: () => {},
  },
} satisfies Meta<typeof BosattITrondheim>;
export default meta;

type Story = StoryObj<typeof meta>;

// Saksbehandler vurderer om bruker bor i Trondheim
export const ÅpentVurderBosted: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(BostedAksjonspunktKode.VURDER_BOSTED)],
  },
};

// Aksjonspunkt utført — read-only visning
export const UtførtBosattVurdering: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(BostedAksjonspunktKode.VURDER_BOSTED, AksjonspunktStatus.UTFØRT)],
    vilkår: {
      ...bostedsvilkår,
      perioder: [
        { periode: { fom: '2024-01-01', tom: '2024-06-30' }, vilkarStatus: Utfall.OPPFYLT },
        { periode: { fom: '2024-07-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_OPPFYLT },
      ],
    } as UngSakVilkårMedPerioderDto,
  },
};

// Ikke-saksbehandler ser read-only visning
export const ReadOnly: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(BostedAksjonspunktKode.VURDER_BOSTED)],
    kanSaksbehandle: false,
  },
};
