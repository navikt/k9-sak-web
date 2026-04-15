import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fakeAktivitetspengerApi } from '../../storybook/mocks/FakeAktivitetspengerApi';
import { BehovForBistand } from './BehovForBistand';

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/BehovForBistand',
  component: BehovForBistand,
  args: {
    api: fakeAktivitetspengerApi,
    behandling: { uuid: 'fake-uuid', versjon: 1 } as unknown as BehandlingDto,
    onAksjonspunktBekreftet: () => {},
    kanSaksbehandle: true,
    readOnly: false,
    vurderBistandsvilkårAp: undefined,
    lokalkontorForeslårVilkårAp: undefined,
    vurderBistandsvilkårVilkår: {
      vilkarType: vilkarType.BISTANDSVILKÅR,
      perioder: [{ periode: { fom: '2024-01-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT }],
    },
  },
} satisfies Meta<typeof BehovForBistand>;
export default meta;

type Story = StoryObj<typeof meta>;

const lagAksjonspunkt = (
  definisjon: AksjonspunktDto['definisjon'],
  status: AksjonspunktDto['status'] = AksjonspunktStatus.OPPRETTET,
): AksjonspunktDto => ({
  definisjon,
  status,
  kanLoses: status === AksjonspunktStatus.OPPRETTET,
  erAktivt: status === AksjonspunktStatus.OPPRETTET,
});

export const MedÅpentBistandsvilkår: Story = {
  args: {
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR),
  },
};

export const MedUtførtBistandsvilkår: Story = {
  args: {
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT),
    vurderBistandsvilkårVilkår: {
      vilkarType: vilkarType.BISTANDSVILKÅR,
      perioder: [
        {
          periode: { fom: '2024-01-01', tom: '2024-12-31' },
          vilkarStatus: Utfall.OPPFYLT,
          begrunnelse: 'Søker har behov for bistand.',
        },
      ],
    },
  },
};

export const MedÅpentLokalkontorForeslår: Story = {
  args: {
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT),
    lokalkontorForeslårVilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR),
  },
};

export const IkkeSaksbehandler: Story = {
  args: {
    kanSaksbehandle: false,
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR),
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    vurderBistandsvilkårAp: lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT),
    vurderBistandsvilkårVilkår: {
      vilkarType: vilkarType.BISTANDSVILKÅR,
      perioder: [
        {
          periode: { fom: '2024-01-01', tom: '2024-12-31' },
          vilkarStatus: Utfall.OPPFYLT,
          begrunnelse: 'Søker har behov for bistand.',
        },
      ],
    },
  },
};
