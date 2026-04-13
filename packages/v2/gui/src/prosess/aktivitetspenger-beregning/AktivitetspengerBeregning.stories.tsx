import type { BeregningsgrunnlagDto } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/BeregningsgrunnlagDto.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { asyncAction } from '../../storybook/asyncAction';
import { FakeAktivitetspengerBeregningBackendApi } from '../../storybook/mocks/FakeAktivitetspengerBeregningBackendApi';
import { AktivitetspengerBeregning } from './AktivitetspengerBeregning';

const data: BeregningsgrunnlagDto = {
  skjæringstidspunkt: '2026-03-17',
  årsinntektSisteÅr: 0,
  årsinntektSisteTreÅr: 93313,
  beregningsgrunnlag: 93313,
  beregningsgrunnlagRedusert: 61587,
  dagsats: 236.87,
  pgiÅrsinntekter: [
    {
      årstall: 2023,
      sum: 250000,
      sumAvkortet: 250000,
      sumAvkortetOgOppjustert: 279940,
      arbeidsinntekt: 0,
      næring: 250000,
    },
    { årstall: 2024, sum: 0, sumAvkortet: 0, sumAvkortetOgOppjustert: 0, arbeidsinntekt: 0, næring: 0 },
    { årstall: 2025, sum: 0, sumAvkortet: 0, sumAvkortetOgOppjustert: 0, arbeidsinntekt: 0, næring: 0 },
  ],
  besteBeregningResultatType: 'SNITT_SISTE_TRE_ÅR',
};

const api = new FakeAktivitetspengerBeregningBackendApi();

class FakeAktivitetspengerBeregningUtenInntektApi extends FakeAktivitetspengerBeregningBackendApi {
  override async getKontrollerInntekt() {
    return {
      kontrollperioder: [],
    };
  }
}

const meta = {
  title: 'gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregning',
  component: AktivitetspengerBeregning,
} satisfies Meta<typeof AktivitetspengerBeregning>;
export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {
  args: {
    data,
    behandling: { uuid: '123', versjon: 1 },
    api,
    submitCallback: asyncAction('Løs aksjonspunkt'),
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

export const ViserInntektskontroll: Story = {
  args: {
    data,
    behandling: { uuid: '123', versjon: 1 },
    api,
    submitCallback: asyncAction('Løs aksjonspunkt'),
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
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Viser inntektskontroll-tab', async () => {
      await expect(canvas.getByRole('tab', { name: 'Inntektskontroll' })).toBeInTheDocument();
    });

    await step('Kan åpne inntektskontroll-tab', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Inntektskontroll' }));
      await expect(canvas.getByText('Rapportert av deltaker')).toBeInTheDocument();
      await expect(canvas.getByText('Rapportert i A-ordningen')).toBeInTheDocument();
    });
  },
};

export const SkjulerInntektskontrollUtenPerioder: Story = {
  args: {
    data,
    behandling: { uuid: 'ingen-perioder', versjon: 1 },
    api: new FakeAktivitetspengerBeregningUtenInntektApi(),
    submitCallback: asyncAction('Løs aksjonspunkt'),
    aksjonspunkter: [],
    isReadOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Skjuler inntektskontroll-tab uten kontrollperioder', async () => {
      await canvas.findByRole('tab', { name: 'Beregningsgrunnlag' });
      await expect(canvas.queryByRole('tab', { name: 'Inntektskontroll' })).not.toBeInTheDocument();
    });
  },
};
