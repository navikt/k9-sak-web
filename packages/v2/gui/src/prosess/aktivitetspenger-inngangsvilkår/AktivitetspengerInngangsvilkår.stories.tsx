import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fakeAktivitetspengerApi } from '../../storybook/mocks/FakeAktivitetspengerApi';
import { AktivitetspengerInngangsvilkår } from './AktivitetspengerInngangsvilkår';

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/AktivitetspengerInngangsvilkår',
  component: AktivitetspengerInngangsvilkår,
  args: {
    innloggetBruker: {
      aktivitetspengerDel1SaksbehandlerTilgang: { kanSaksbehandle: true },
    } satisfies InnloggetAnsattUngV2Dto,
    lovligeBehandlingsoperasjoner: {
      uuid: 'fake-uuid',
      behandlingTilGodkjenningVedLokalkontor: true,
    },
    vilkår: [],
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

const fakeBehandling = {
  uuid: 'fake-uuid',
  versjon: 1,
} as unknown as BehandlingDto;

const fakeBostedVilkårPeriode = {
  periode: { fom: '2024-01-01', tom: '2024-12-31' },
  vilkarStatus: Utfall.IKKE_VURDERT,
};

const fakeBostedVilkår = {
  vilkarType: vilkarType.BOSTEDSVILKÅR,
  perioder: [fakeBostedVilkårPeriode],
};

export const MedÅpentBistandsvilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR)],
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: () => {},
    totrinnskontrollSkjermlenkeContext: [],
  },
};

export const MedUtførtBistandsvilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT)],
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: () => {},
    totrinnskontrollSkjermlenkeContext: [],
  },
};

export const MedÅpentLokalkontorForeslårVilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR)],
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: () => {},
    totrinnskontrollSkjermlenkeContext: [],
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
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: () => {},
    totrinnskontrollSkjermlenkeContext: [
      {
        skjermlenkeType: 'BOSATT_I_TRONDHEIM',
        totrinnskontrollAksjonspunkter: [{ aksjonspunktKode: '5014', totrinnskontrollGodkjent: undefined }],
      },
      {
        skjermlenkeType: 'BEHOV_FOR_BISTAND',
        totrinnskontrollAksjonspunkter: [
          { aksjonspunktKode: AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, totrinnskontrollGodkjent: undefined },
        ],
      },
    ] satisfies TotrinnskontrollSkjermlenkeContextDto[],
  },
};

export const MedÅpentBostedVilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTED)],
    vilkår: [fakeBostedVilkår],
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: () => {},
    totrinnskontrollSkjermlenkeContext: [],
  },
};

export const MedUtførtBostedVilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTED, AksjonspunktStatus.UTFØRT)],
    vilkår: [{ ...fakeBostedVilkår, perioder: [{ ...fakeBostedVilkårPeriode, vilkarStatus: Utfall.OPPFYLT }] }],
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: () => {},
    totrinnskontrollSkjermlenkeContext: [],
  },
};
