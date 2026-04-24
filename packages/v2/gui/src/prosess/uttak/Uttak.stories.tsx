import { BehandlingProvider } from '@k9-sak-web/gui/context/BehandlingContext.js';
import { withFakeUttakBackend } from '@k9-sak-web/gui/storybook/decorators/withFakeUttakBackend.js';
import {
  arbeidsgivereWithTilkommet,
  Endringsstatus,
  inntektsgraderingFlereArbeidsgivere,
  lagAvsluttetBehandling,
  lagIkkeOppfyltPeriode,
  lagInntektsgraderingPeriode,
  lagOppfyltPeriode,
  lagTilsynsgraderingPeriode,
  lagUtredBehandling,
  lagUttak,
  relevanteAksjonspunkterAlle,
  Årsak,
} from '@k9-sak-web/gui/storybook/mocks/uttak/uttakStoryMocks.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import Uttak from './Uttak';

const meta = {
  title: 'gui/prosess/Uttak',
  component: Uttak,
  parameters: {
    docs: {
      description: {
        component: 'Hovedkomponent for uttak som håndterer uttaksperioder og vurderinger. ',
      },
    },
  },
  decorators: [
    Story => (
      <BehandlingProvider refetchBehandling={fn()}>
        <Story />
      </BehandlingProvider>
    ),
  ],
  tags: ['uttak', 'uttakVisning'],
} satisfies Meta<typeof Uttak>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * UttakBasis
 * Viser perioder og kan åpne/lukke periodedetaljer
 */
export const UttakBasis: Story = {
  decorators: [withFakeUttakBackend()],
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([
      lagOppfyltPeriode('2024-01-01/2024-01-15', {
        søkersTapteArbeidstid: 100,
        utbetalingsgrader: [
          {
            arbeidsforhold: { type: 'ARBEIDSTAKER', organisasjonsnummer: '123456789' },
            normalArbeidstid: 'PT7H30M',
            faktiskArbeidstid: 'PT0S',
            utbetalingsgrad: 100,
            tilkommet: false,
          },
        ],
      }),
      lagOppfyltPeriode('2024-01-16/2024-01-31', {
        søkersTapteArbeidstid: 100,
        utbetalingsgrader: [
          {
            arbeidsforhold: { type: 'ARBEIDSTAKER', organisasjonsnummer: '123456789' },
            normalArbeidstid: 'PT7H30M',
            faktiskArbeidstid: 'PT0S',
            utbetalingsgrad: 100,
            tilkommet: false,
          },
        ],
      }),
      lagOppfyltPeriode('2024-02-01/2024-02-14', {
        søkersTapteArbeidstid: 100,
        utbetalingsgrader: [
          {
            arbeidsforhold: { type: 'ARBEIDSTAKER', organisasjonsnummer: '123456789' },
            normalArbeidstid: 'PT7H30M',
            faktiskArbeidstid: 'PT0S',
            utbetalingsgrad: 100,
            tilkommet: false,
          },
        ],
      }),
    ]),
    erOverstyrer: false,
    aksjonspunkter: [],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Viser perioder', async () => {
      // Sjekk at periodedatoer er synlige
      await expect(canvas.getByText(/01\.01\.2024/)).toBeInTheDocument();
      await expect(canvas.getByText(/15\.01\.2024/)).toBeInTheDocument();
      await expect(canvas.getByText(/16\.01\.2024/)).toBeInTheDocument();
      await expect(canvas.getByText(/31\.01\.2024/)).toBeInTheDocument();
    });

    await step('Kan åpne/lukke periodedetaljer', async () => {
      // Finn ekspanderbare elementer (knapper eller overskrifter)
      const expandButtons = canvas.queryAllByRole('button');
      await expect(expandButtons.length).toEqual(3);

      if (expandButtons.length > 0 && expandButtons[0]) {
        // Klikk på første ekspanderbare element
        const expandButton = expandButtons[0];

        await user.click(expandButton);
        await expect(canvas.getByRole('heading', { name: 'Gradering mot tilsyn' })).toBeInTheDocument();
        await expect(canvas.getByRole('heading', { name: 'Gradering mot arbeidstid' })).toBeInTheDocument();

        await expect(canvas.getAllByText('= 100 % tilgjengelig til søker')[0]).toBeVisible();
        await expect(canvas.getAllByText('= 100 % tilgjengelig til søker')[1]).not.toBeVisible();
        await expect(canvas.getAllByText('= 100 % tilgjengelig til søker')[2]).not.toBeVisible();

        await expect(canvas.getAllByText('- Andre søkeres tilsyn: 0 %')[0]).toBeVisible();

        await waitFor(
          async function sjekkBedrift() {
            await expect(canvas.getAllByText('Bedrift AS (123456789)')[0]).toBeVisible();
          },
          { timeout: 5000 },
        );

        await user.click(expandButton);

        await expect(canvas.queryByRole('heading', { name: 'Gradering mot tilsyn' })).not.toBeInTheDocument();
        await expect(canvas.queryByRole('heading', { name: 'Gradering mot arbeidstid' })).not.toBeInTheDocument();
      }
    });
  },
};

/*
 * UttakMedUlikeStatuser
 *
 * Viser perioder med ulike status
 *  - Oppfylt
 *  - Ikke oppfylt
 *  - Inntektsgradering
 *  - Tilsynsgradering
 */
export const UttakMedUlikeStatuser: Story = {
  decorators: [
    withFakeUttakBackend({
      inntektsgraderinger: {
        perioder: [
          {
            periode: { fom: '2024-03-01', tom: '2024-03-15' },
            beregningsgrunnlag: 500000,
            løpendeInntekt: 200000,
            bortfaltInntekt: 300000,
            reduksjonsProsent: 40,
            graderingsProsent: 60,
            inntektsforhold: [
              {
                arbeidsgiverIdentifikator: '123456789',
                arbeidstidprosent: 40,
                bruttoInntekt: 500000,
                løpendeInntekt: 200000,
                erNytt: false,
                type: 'AT',
              },
            ],
          },
        ],
      },
    }),
  ],
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([
      lagOppfyltPeriode('2024-01-01/2024-01-15', {
        årsaker: [Årsak.FULL_DEKNING],
      }),
      lagOppfyltPeriode('2024-01-16/2024-01-31', {
        uttaksgrad: 60,
        søkersTapteArbeidstid: 60,
        årsaker: [Årsak.AVKORTET_MOT_INNTEKT],
        utbetalingsgrader: [
          {
            arbeidsforhold: { type: 'ARBEIDSTAKER', organisasjonsnummer: '123456789' },
            normalArbeidstid: 'PT7H30M',
            faktiskArbeidstid: 'PT3H',
            utbetalingsgrad: 60,
            tilkommet: false,
          },
        ],
      }),
      lagIkkeOppfyltPeriode('2024-02-01/2024-02-14', [Årsak.FOR_LAV_TAPT_ARBEIDSTID, Årsak.AVKORTET_MOT_INNTEKT], {
        uttaksgrad: 0,
        søkersTapteArbeidstid: 15,
        utbetalingsgrader: [
          {
            arbeidsforhold: { type: 'ARBEIDSTAKER', organisasjonsnummer: '123456789' },
            normalArbeidstid: 'PT7H30M',
            faktiskArbeidstid: 'PT6H22M',
            utbetalingsgrad: 0,
            tilkommet: false,
          },
        ],
      }),
      lagIkkeOppfyltPeriode('2024-02-15/2024-02-28', [
        Årsak.INNGANGSVILKÅR_IKKE_OPPFYLT,
        Årsak.FOR_MANGE_DAGER_UTENLANDSOPPHOLD,
      ]),
      lagInntektsgraderingPeriode('2024-03-01/2024-03-15', 60, [{ orgnr: '123456789', utbetalingsgrad: 60 }]),
      lagTilsynsgraderingPeriode('2024-03-16/2024-03-31', 30, 0),
      lagIkkeOppfyltPeriode('2024-04-01/2024-04-14', [Årsak.INGEN_TAPT_INNTEKT_PGA_FP]),
    ]),
    erOverstyrer: false,
    aksjonspunkter: [],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Viser riktige perioder', async () => {
      await waitFor(async () => {
        const buttons = canvas.getAllByRole('button', { name: 'Åpne' });
        await expect(buttons.length).toEqual(7);
      });
    });
  },
};

/**
 * UttakGradertMotInntekt
 */
export const UttakGradertMotInntekt: Story = {
  decorators: [
    withFakeUttakBackend({
      arbeidsgivere: arbeidsgivereWithTilkommet,
      inntektsgraderinger: inntektsgraderingFlereArbeidsgivere,
    }),
  ],
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([
      // Periode med én arbeidsgiver, 70% uttak (30% arbeid)
      lagInntektsgraderingPeriode('2024-01-01/2024-01-15', 70, [{ orgnr: '123456789', utbetalingsgrad: 70 }]),
      // Periode med to arbeidsgivere, 50% uttak (50% arbeid fordelt mellom arbeidsgivere)
      lagInntektsgraderingPeriode('2024-01-16/2024-01-31', 50, [
        { orgnr: '123456789', utbetalingsgrad: 25 },
        { orgnr: '987654321', utbetalingsgrad: 25 },
      ]),
      // Periode med ny arbeidsgiver (tilkommet), 40% uttak
      lagInntektsgraderingPeriode('2024-02-01/2024-02-14', 40, [
        { orgnr: '123456789', utbetalingsgrad: 20 },
        { orgnr: '555666777', utbetalingsgrad: 20, tilkommet: true },
      ]),
    ]),
    erOverstyrer: false,
    aksjonspunkter: [],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Viser riktige perioder', async () => {
      await waitFor(async () => {
        const buttons = canvas.getAllByRole('button', { name: 'Åpne' });
        await expect(buttons.length).toEqual(3);
      });
    });
  },
};

/**
 * UttakGradertMotTilsyn
 *
 * Viser perioder med gradering mot tilsyn
 */
export const UttakGradertMotTilsyn: Story = {
  decorators: [withFakeUttakBackend()],
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([
      // Periode med 30% etablert tilsyn, 70% tilgjengelig for søker
      lagTilsynsgraderingPeriode('2024-01-01/2024-01-15', 30, 0),
      // Periode med 20% etablert tilsyn og 20% andre søkeres tilsyn, 60% tilgjengelig
      lagTilsynsgraderingPeriode('2024-01-16/2024-01-31', 20, 20),
      // Periode med 50% etablert tilsyn, 50% tilgjengelig
      lagTilsynsgraderingPeriode('2024-02-01/2024-02-14', 50, 0),
      // Periode med høy tilsynsdekning, kun 25% tilgjengelig
      lagTilsynsgraderingPeriode('2024-02-15/2024-02-28', 40, 35),
    ]),
    erOverstyrer: false,
    aksjonspunkter: [],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Viser riktige perioder', async () => {
      await waitFor(async () => {
        const buttons = canvas.getAllByRole('button', { name: 'Åpne' });
        await expect(buttons.length).toEqual(4);
      });
    });
  },
};

/**
 * UttakLesemodus
 *
 * Demonstrerer:
 * - Lesemodus for uttak
 * - Viser perioder med uttaksgrad og tilkommet arbeidsgiver
 *
 */
export const UttakLesemodus: Story = {
  decorators: [withFakeUttakBackend()],
  args: {
    behandling: lagAvsluttetBehandling(),
    uttak: lagUttak([
      lagOppfyltPeriode('2024-01-01/2024-01-15'),
      lagOppfyltPeriode('2024-01-16/2024-01-31', {
        uttaksgrad: 80,
        søkersTapteArbeidstid: 80, // Må matche uttaksgrad
        årsaker: [Årsak.AVKORTET_MOT_INNTEKT],
      }),
      lagOppfyltPeriode('2024-02-01/2024-02-14', {
        uttaksgrad: 60,
        søkersTapteArbeidstid: 80, // 80% tapt arbeidstid, men kun 60% tilgjengelig pga tilsyn
        årsaker: [Årsak.GRADERT_MOT_TILSYN],
        etablertTilsyn: 40, // 40% etablert tilsyn reduserer tilgjengelig uttak
        utbetalingsgrader: [
          {
            arbeidsforhold: { type: 'ARBEIDSTAKER', organisasjonsnummer: '123456789' },
            normalArbeidstid: 'PT7H30M', // 7.5 timer normal arbeidsdag
            faktiskArbeidstid: 'PT1H30M', // 1.5 timer faktisk arbeid (20% arbeid = 80% fravær)
            utbetalingsgrad: 60, // Utbetalingsgrad begrenset av tilsyn, ikke arbeidstid
            tilkommet: false,
          },
        ],
      }),
    ]),
    erOverstyrer: false,
    aksjonspunkter: [],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Viser riktige perioder', async () => {
      await expect(
        canvas.getByRole('row', { name: '5 - 7 01.02.2024 - 14.02.2024 100% Søker 60 % Ny denne behandlingen' }),
      );
      await expect(
        canvas.getByRole('row', { name: '3 - 5 16.01.2024 - 31.01.2024 100% Søker 80 % Ny denne behandlingen' }),
      );
      await expect(
        canvas.getByRole('row', { name: '1 - 3 01.01.2024 - 15.01.2024 100% Søker 100 % Ny denne behandlingen' }),
      );
    });
  },
};

/**
 * UttakMedOpphold
 *
 * Et opphold mellom uke 10 og uke 11 (mandag 09.03 er en ukedag i gapet).
 */
export const UttakMedOpphold: Story = {
  decorators: [withFakeUttakBackend()],
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([
      lagIkkeOppfyltPeriode('2026-02-24/2026-02-24', [Årsak.FOR_LAV_TAPT_ARBEIDSTID], {
        uttaksgrad: 0,
        endringsstatus: Endringsstatus.ENDRET,
        utbetalingsgrader: [
          {
            arbeidsforhold: { type: 'ARBEIDSTAKER', organisasjonsnummer: '123456789' },
            normalArbeidstid: 'PT7H30M',
            faktiskArbeidstid: 'PT7H30M',
            utbetalingsgrad: 0,
            tilkommet: false,
          },
        ],
      }),
      lagOppfyltPeriode('2026-02-25/2026-02-25', {
        uttaksgrad: 27,
        søkersTapteArbeidstid: 27,
        årsaker: [Årsak.AVKORTET_MOT_INNTEKT],
        endringsstatus: Endringsstatus.ENDRET,
        utbetalingsgrader: [
          {
            arbeidsforhold: { type: 'ARBEIDSTAKER', organisasjonsnummer: '123456789' },
            normalArbeidstid: 'PT7H30M',
            faktiskArbeidstid: 'PT5H28M',
            utbetalingsgrad: 27,
            tilkommet: false,
          },
        ],
      }),
      lagOppfyltPeriode('2026-02-26/2026-02-27', {
        uttaksgrad: 20,
        søkersTapteArbeidstid: 20,
        årsaker: [Årsak.AVKORTET_MOT_INNTEKT],
        endringsstatus: Endringsstatus.UENDRET,
        utbetalingsgrader: [
          {
            arbeidsforhold: { type: 'ARBEIDSTAKER', organisasjonsnummer: '123456789' },
            normalArbeidstid: 'PT7H30M',
            faktiskArbeidstid: 'PT6H',
            utbetalingsgrad: 20,
            tilkommet: false,
          },
        ],
      }),
      lagOppfyltPeriode('2026-03-02/2026-03-06', {
        uttaksgrad: 20,
        søkersTapteArbeidstid: 20,
        årsaker: [Årsak.AVKORTET_MOT_INNTEKT],
        endringsstatus: Endringsstatus.NY,
        utbetalingsgrader: [
          {
            arbeidsforhold: { type: 'ARBEIDSTAKER', organisasjonsnummer: '123456789' },
            normalArbeidstid: 'PT7H30M',
            faktiskArbeidstid: 'PT6H',
            utbetalingsgrad: 20,
            tilkommet: false,
          },
        ],
      }),
      // Gap mellom 06.03 og 10.03: 07.03 lørdag, 08.03 søndag, 09.03 mandag (ukedag) → opphold
      lagOppfyltPeriode('2026-03-10/2026-03-10', {
        uttaksgrad: 100,
        søkersTapteArbeidstid: 100,
        årsaker: [Årsak.FULL_DEKNING],
        endringsstatus: Endringsstatus.NY,
      }),
    ]),
    erOverstyrer: false,
    aksjonspunkter: [],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: true,
  },
};
