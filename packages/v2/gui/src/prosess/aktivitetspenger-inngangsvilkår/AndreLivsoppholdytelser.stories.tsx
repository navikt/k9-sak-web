import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fakeAktivitetspengerApi } from '../../storybook/mocks/FakeAktivitetspengerApi';
import { AndreLivsoppholdytelser } from './AndreLivsoppholdytelser';

const lagAksjonspunkt = (
  definisjon: AksjonspunktDto['definisjon'],
  status: AksjonspunktDto['status'] = AksjonspunktStatus.OPPRETTET,
): AksjonspunktDto => ({
  definisjon,
  status,
  kanLoses: status === AksjonspunktStatus.OPPRETTET,
  erAktivt: status === AksjonspunktStatus.OPPRETTET,
});

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/AndreLivsoppholdytelser',
  component: AndreLivsoppholdytelser,
  args: {
    api: fakeAktivitetspengerApi,
    behandling: { uuid: 'fake-uuid', versjon: 1 } as unknown as BehandlingDto,
    onAksjonspunktBekreftet: () => {},
    readOnly: false,
  },
} satisfies Meta<typeof AndreLivsoppholdytelser>;
export default meta;

type Story = StoryObj<typeof meta>;

const periode = { fom: '2024-01-01', tom: '2024-12-31' };

export const IkkeVurdert: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.IKKE_VURDERT }],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
};

export const Oppfylt: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker har ingen andre livsoppholdytelser.' }],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
};

export const IkkeOppfylt: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [
        {
          periode,
          vilkarStatus: Utfall.IKKE_OPPFYLT,
          begrunnelse: 'Søker mottar dagpenger.',
          avslagKode: '3003',
        },
      ],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [{ periode, vilkarStatus: Utfall.OPPFYLT, begrunnelse: 'Søker har ingen andre livsoppholdytelser.' }],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
};

export const FlerePerioder: Story = {
  args: {
    andreLivsoppholdytelserVilkår: {
      vilkarType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
      perioder: [
        {
          periode: { fom: '2024-01-01', tom: '2024-06-30' },
          vilkarStatus: Utfall.OPPFYLT,
          begrunnelse: 'Ingen andre ytelser.',
        },
        { periode: { fom: '2024-07-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT },
      ],
    },
    andreLivsoppholdytelserAp: lagAksjonspunkt(
      AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
      AksjonspunktStatus.UTFØRT,
    ),
    isPermanentlyReadOnly: false,
  },
};
