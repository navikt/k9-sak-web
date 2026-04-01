import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { asyncAction } from '../../storybook/asyncAction';
import { AktivitetspengerInngangsvilkår } from './AktivitetspengerInngangsvilkår';

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/AktivitetspengerInngangsvilkår',
  component: AktivitetspengerInngangsvilkår,
  args: {
    innloggetBruker: {
      aktivitetspengerDel1SaksbehandlerTilgang: { kanSaksbehandle: true },
    } satisfies InnloggetAnsattUngV2Dto,
    submitCallback: asyncAction('submitCallback'),
  },
} satisfies Meta<typeof AktivitetspengerInngangsvilkår>;
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
  },
};

export const MedUtførtBistandsvilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT)],
  },
};

export const MedÅpentLokalkontorForeslårVilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR)],
  },
};

export const MedÅpentLokalkontorBeslutterVilkår: Story = {
  args: {
    aksjonspunkter: [
      lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT),
      lagAksjonspunkt(AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR),
    ],
    innloggetBruker: {
      aktivitetspengerDel1SaksbehandlerTilgang: { kanSaksbehandle: true, kanBeslutte: true },
    } satisfies InnloggetAnsattUngV2Dto,
  },
};
