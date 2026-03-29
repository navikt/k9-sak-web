import { ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { asyncAction } from '../../storybook/asyncAction';
import { SplittPanel } from './SplittPanel';

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/SplittPanel',
  component: SplittPanel,
} satisfies Meta<typeof SplittPanel>;
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
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR)],
    submitCallback: asyncAction('submitCallback'),
  },
};

export const MedUtførtBistandsvilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT)],
    submitCallback: asyncAction('submitCallback'),
  },
};

export const MedÅpentLokalkontorForeslårVilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR)],
    submitCallback: asyncAction('submitCallback'),
  },
};
