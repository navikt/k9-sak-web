import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { SkjermlenkeType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/SkjermlenkeType.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { InnloggetAnsattUngV2Dto } from '@k9-sak-web/backend/ungsak/kontrakt/nav-ansatt/InnloggetAnsattUngV2Dto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
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
      behandlingTilGodkjenningVedNavKontor: true,
    },
    bostedGrunnlag: {
      perioder: [],
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
    onAksjonspunktBekreftet: async () => {},
    totrinnskontrollSkjermlenkeContext: [],
  },
};

export const MedUtførtBistandsvilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT)],
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: async () => {},
    totrinnskontrollSkjermlenkeContext: [],
  },
};

export const MedÅpentLokalkontorForeslårVilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_FORESLÅR_VILKÅR)],
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: async () => {},
    totrinnskontrollSkjermlenkeContext: [],
  },
};

export const MedÅpentLokalkontorBeslutterVilkår: Story = {
  args: {
    aksjonspunkter: [
      lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT),
      lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_BESLUTTER_VILKÅR),
    ],
    innloggetBruker: {
      aktivitetspengerDel1SaksbehandlerTilgang: { kanSaksbehandle: true, kanBeslutte: true },
    } satisfies InnloggetAnsattUngV2Dto,
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    vilkår: [{ ...fakeBostedVilkår, perioder: [{ ...fakeBostedVilkårPeriode, vurderesIBehandlingen: true }] }],
    onAksjonspunktBekreftet: async () => {},
    totrinnskontrollSkjermlenkeContext: [
      {
        skjermlenkeType: SkjermlenkeType.BOSTEDSVILKÅR,
        totrinnskontrollAksjonspunkter: [{ aksjonspunktKode: '5014', totrinnskontrollGodkjent: undefined }],
      },
      {
        skjermlenkeType: SkjermlenkeType.BISTANDSVILKÅR,
        totrinnskontrollAksjonspunkter: [
          { aksjonspunktKode: AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, totrinnskontrollGodkjent: undefined },
        ],
      },
    ] satisfies TotrinnskontrollSkjermlenkeContextDto[],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab', { name: 'Beslutter' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel', { name: 'Beslutter' })).toBeVisible();
    await expect(canvas.getByText('01.01.2024')).toBeInTheDocument();
  },
};

export const MedÅpentLokalkontorBeslutterVilkårPåVent: Story = {
  args: {
    ...MedÅpentLokalkontorBeslutterVilkår.args,
    behandling: { ...fakeBehandling, behandlingPåVent: true },
    totrinnskontrollSkjermlenkeContext: [
      {
        skjermlenkeType: SkjermlenkeType.BOSTEDSVILKÅR,
        totrinnskontrollAksjonspunkter: [
          { aksjonspunktKode: '5014', totrinnskontrollGodkjent: true },
        ],
      },
      {
        skjermlenkeType: SkjermlenkeType.BISTANDSVILKÅR,
        totrinnskontrollAksjonspunkter: [
          {
            aksjonspunktKode: AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
            totrinnskontrollGodkjent: true,
          },
        ],
      },
    ] satisfies TotrinnskontrollSkjermlenkeContextDto[],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('tab', { name: 'Beslutter' })).toHaveAttribute('aria-selected', 'true');
    const radioer = canvas.getAllByRole('radio');
    await expect(radioer).toHaveLength(4);
    for (const radio of radioer) {
      await expect(radio).toBeDisabled();
    }
    const godkjentRadioer = canvas.getAllByRole('radio', { name: 'Godkjent' });
    await expect(godkjentRadioer).toHaveLength(2);
    for (const radio of godkjentRadioer) {
      await expect(radio).toBeChecked();
    }
    await expect(canvas.queryByRole('button', { name: 'Bekreft' })).not.toBeInTheDocument();
    await expect(canvas.queryByText('Saken er sendt til beslutter.')).not.toBeInTheDocument();
  },
};

export const MedUtførtLokalkontorBeslutterVilkår: Story = {
  args: {
    ...MedÅpentLokalkontorBeslutterVilkår.args,
    aksjonspunkter: [
      lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR, AksjonspunktStatus.UTFØRT),
      lagAksjonspunkt(AksjonspunktDefinisjon.NAV_KONTOR_BESLUTTER_VILKÅR, AksjonspunktStatus.UTFØRT),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('tab', { name: 'Beslutter' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('tabpanel', { name: 'Beslutter', hidden: true })).not.toBeInTheDocument();
    await expect(canvas.getByRole('tab', { name: 'Behov for bistand' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel', { name: 'Behov for bistand' })).toBeVisible();
  },
};

export const MedÅpentBostedVilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR)],
    vilkår: [fakeBostedVilkår],
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: async () => {},
    totrinnskontrollSkjermlenkeContext: [],
  },
};

export const MedÅpentBostedVilkårPåVent: Story = {
  args: {
    ...MedÅpentBostedVilkår.args,
    behandling: { ...fakeBehandling, behandlingPåVent: true },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab', { name: 'Bosatt i Trondheim kommune' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
  },
};

export const MedUtførtBostedVilkår: Story = {
  args: {
    aksjonspunkter: [lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR, AksjonspunktStatus.UTFØRT)],
    vilkår: [{ ...fakeBostedVilkår, perioder: [{ ...fakeBostedVilkårPeriode, vilkarStatus: Utfall.OPPFYLT }] }],
    api: fakeAktivitetspengerApi,
    behandling: fakeBehandling,
    onAksjonspunktBekreftet: async () => {},
    totrinnskontrollSkjermlenkeContext: [],
  },
};
