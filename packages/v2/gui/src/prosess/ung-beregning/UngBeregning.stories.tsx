import {
  ung_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as AksjonspunktStatus,
  type ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  type ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto,
  type ung_sak_kontrakt_kontroll_KontrollerInntektPeriodeDto as KontrollerInntektPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import { BrukKontrollertInntektValg } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/BrukKontrollertInntektValg.js';
import { PeriodeStatus } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/PeriodeStatus.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { asyncAction } from '../../storybook/asyncAction.js';
import { FakeUngBeregningBackendApi } from '../../storybook/mocks/FakeUngBeregningBackendApi.js';
import UngBeregning from './UngBeregning.js';

const api = new FakeUngBeregningBackendApi();
const meta = {
  title: 'gui/prosess/ung-beregning/UngBeregning.tsx',
  component: UngBeregning,
} satisfies Meta<typeof UngBeregning>;
export default meta;

type Story = StoryObj<typeof meta>;

const lagKontrollerInntektAksjonspunkt = (status: AksjonspunktDto['status']): AksjonspunktDto => ({
  aksjonspunktType: 'MANU',
  definisjon: aksjonspunktCodes.KONTROLLER_INNTEKT,
  erAktivt: true,
  kanLoses: true,
  status,
  toTrinnsBehandling: true,
  opprettetAv: 'vtp',
  begrunnelse: status === AksjonspunktStatus.UTFØRT ? 'Deltaker har fått forskuttert lønn.' : undefined,
});

const arbeidsgivere = {
  arbeidsgivere: {
    '896929119': { identifikator: '896929119', navn: 'Sauefabrikk AS' },
    '972674818': { identifikator: '972674818', navn: 'Pengeløs Sparebank' },
  },
} satisfies ArbeidsgiverOversiktDto;

const februar = { fom: '2025-02-01', tom: '2025-02-28' };

const periodeMedAvvik = {
  erTilVurdering: true,
  periode: februar,
  status: PeriodeStatus.AVVIK,
  rapporterteInntekter: {
    bruker: { arbeidsinntekt: 10000 },
    register: {
      inntekter: [
        { arbeidsgiverIdentifikator: '896929119', inntekt: 12000 },
        { arbeidsgiverIdentifikator: '972674818', inntekt: 3500 },
      ],
      oppsummertRegister: { arbeidsinntekt: 15500 },
    },
  },
  uttalelseFraBruker: 'Jeg fikk forskuttert litt lønn av arbeidsgiver denne måneden.',
} satisfies KontrollerInntektPeriodeDto;

const periodeUtenAvvik = {
  erTilVurdering: false,
  periode: { fom: '2025-03-01', tom: '2025-03-31' },
  status: PeriodeStatus.INGEN_AVVIK,
  rapporterteInntekter: {
    bruker: { arbeidsinntekt: 8000 },
    register: {
      inntekter: [{ arbeidsgiverIdentifikator: '896929119', inntekt: 8000 }],
      oppsummertRegister: { arbeidsinntekt: 8000 },
    },
  },
} satisfies KontrollerInntektPeriodeDto;

const periodeUtenInntekt = {
  erTilVurdering: false,
  periode: { fom: '2025-01-01', tom: '2025-01-31' },
  status: PeriodeStatus.INGEN_AVVIK,
  rapporterteInntekter: { bruker: {}, register: { oppsummertRegister: {} } },
} satisfies KontrollerInntektPeriodeDto;

const vurdertPeriodeMedAvvik = {
  ...periodeMedAvvik,
  valg: BrukKontrollertInntektValg.MANUELT_FASTSATT,
  fastsattInntekt: 12000,
  begrunnelse: 'Deltaker har fått forskuttert lønn.',
} satisfies KontrollerInntektPeriodeDto;

const apiMedÅpenKontroll = new FakeUngBeregningBackendApi({
  kontrollerInntekt: { kontrollperioder: [periodeUtenInntekt, periodeMedAvvik, periodeUtenAvvik] },
  arbeidsgivere,
});

const apiMedVurdertKontroll = new FakeUngBeregningBackendApi({
  kontrollerInntekt: { kontrollperioder: [periodeUtenInntekt, vurdertPeriodeMedAvvik, periodeUtenAvvik] },
  arbeidsgivere,
});

const apiUtenAvvik = new FakeUngBeregningBackendApi({
  kontrollerInntekt: { kontrollperioder: [periodeUtenInntekt, periodeUtenAvvik] },
  arbeidsgivere,
});

const fellesArgs = {
  behandling: { uuid: '123', versjon: 1 },
  barn: [],
  inntektKontrollertCallback: asyncAction('Inntekt kontrollert'),
};

const ventPåInntektsfanen = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  await expect(await canvas.findByRole('tab', { name: 'Inntekt', selected: true })).toBeInTheDocument();
  return canvas;
};

export const DefaultStory: Story = {
  args: {
    behandling: { uuid: '123', versjon: 1 },
    api,
    barn: [
      {
        navn: 'Duck Dole',
        fødselsdato: '1.1.2020',
        dødsdato: '',
      },
    ],
    inntektKontrollertCallback: asyncAction('Inntekt kontrollert'),
    aksjonspunkter: [
      {
        aksjonspunktType: 'MANU',
        begrunnelse: undefined,
        definisjon: '8000',
        erAktivt: true,
        kanLoses: true,
        status: 'OPPR',
        toTrinnsBehandling: true,
        opprettetAv: 'vtp',
      },
    ],
    isReadOnly: false,
  },
};

export const ÅpentAksjonspunkt: Story = {
  args: {
    ...fellesArgs,
    api: apiMedÅpenKontroll,
    aksjonspunkter: [lagKontrollerInntektAksjonspunkt(AksjonspunktStatus.OPPRETTET)],
    isReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = await ventPåInntektsfanen(canvasElement);

    await step('Viser alle kontrollperioder med status', async () => {
      await expect(canvas.getByText('Avvik')).toBeInTheDocument();
      await expect(canvas.getAllByText('Ingen avvik')).toHaveLength(2);
    });

    await step('Viser detaljer om inntekt med arbeidsgivernavn', async () => {
      await expect(canvas.getByText('Pengeløs Sparebank (972674818)')).toBeVisible();
      await expect(canvas.getByText(periodeMedAvvik.uttalelseFraBruker)).toBeVisible();
    });

    await step('Viser skjema for å løse aksjonspunktet', async () => {
      await expect(canvas.getByLabelText('Vurder hvilken inntekt som skal gi reduksjon i perioden')).toBeEnabled();
      await expect(canvas.getByRole('radio', { name: 'Rapportert inntekt fra deltaker' })).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
    });
  },
};

export const BekreftFastsattInntekt: Story = {
  args: {
    ...fellesArgs,
    api: apiMedÅpenKontroll,
    inntektKontrollertCallback: fn(asyncAction('Inntekt kontrollert')),
    aksjonspunkter: [lagKontrollerInntektAksjonspunkt(AksjonspunktStatus.OPPRETTET)],
    isReadOnly: false,
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = await ventPåInntektsfanen(canvasElement);
    const user = userEvent.setup();
    const begrunnelse = 'Deltaker har fått forskuttert lønn.';

    await step('Fyller ut og sender inn vurderingen', async () => {
      await user.type(canvas.getByLabelText('Vurder hvilken inntekt som skal gi reduksjon i perioden'), begrunnelse);
      await user.click(canvas.getByRole('radio', { name: 'Fastsett beløp' }));
      await user.type(canvas.getByLabelText('Oppgi samlet arbeidsinntekt og ytelse'), '12000');
      await user.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
    });

    await step('Sender kun perioden med avvik til backend', async () => {
      await expect(args.inntektKontrollertCallback).toHaveBeenCalledWith({
        begrunnelse,
        perioder: [
          {
            periode: februar,
            fastsattInnntekt: 12000,
            valg: BrukKontrollertInntektValg.MANUELT_FASTSATT,
            begrunnelse,
          },
        ],
      });
    });
  },
};

export const ÅpentAksjonspunktForVeileder: Story = {
  args: {
    ...fellesArgs,
    api: apiMedÅpenKontroll,
    aksjonspunkter: [lagKontrollerInntektAksjonspunkt(AksjonspunktStatus.OPPRETTET)],
    isReadOnly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = await ventPåInntektsfanen(canvasElement);
    await expect(canvas.getByText(periodeMedAvvik.uttalelseFraBruker)).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
  },
};

export const RedigerVurdering: Story = {
  args: {
    ...fellesArgs,
    api: apiMedVurdertKontroll,
    aksjonspunkter: [lagKontrollerInntektAksjonspunkt(AksjonspunktStatus.UTFØRT)],
    isReadOnly: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = await ventPåInntektsfanen(canvasElement);
    await expect(canvas.getByLabelText('Vurder hvilken inntekt som skal gi reduksjon i perioden')).toHaveValue(
      vurdertPeriodeMedAvvik.begrunnelse,
    );
    await expect(canvas.getByRole('radio', { name: 'Fastsett beløp' })).toBeChecked();
    await expect(canvas.getByLabelText('Oppgi samlet arbeidsinntekt og ytelse')).toHaveValue('12 000');
    await expect(canvas.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
  },
};

export const LesevisningForBeslutter: Story = {
  args: {
    ...fellesArgs,
    api: apiMedVurdertKontroll,
    aksjonspunkter: [lagKontrollerInntektAksjonspunkt(AksjonspunktStatus.UTFØRT)],
    isReadOnly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = await ventPåInntektsfanen(canvasElement);
    await expect(canvas.getByText(vurdertPeriodeMedAvvik.begrunnelse)).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
  },
};

export const IngenAvvik: Story = {
  args: {
    ...fellesArgs,
    api: apiUtenAvvik,
    aksjonspunkter: [],
    isReadOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Viser dagsats-fanen når det ikke finnes aksjonspunkt', async () => {
      await expect(
        await canvas.findByRole('tab', { name: 'Dagsats og utbetaling', selected: true }),
      ).toBeInTheDocument();
    });

    await step('Viser perioder uten avvik i inntektsfanen', async () => {
      await user.click(canvas.getByRole('tab', { name: 'Inntekt' }));
      await expect(canvas.getAllByText('Ingen avvik')).toHaveLength(2);
      await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    });

    await step('Viser detaljer om inntekt når raden ekspanderes', async () => {
      await expect(canvas.getByText('Sauefabrikk AS (896929119)')).not.toBeVisible();
      await user.click(canvas.getByText(/01\.03\.2025/));
      await expect(await canvas.findByText('Sauefabrikk AS (896929119)')).toBeVisible();
    });
  },
};
