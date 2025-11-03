import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within, expect, waitFor } from 'storybook/test';
import { BehandlingProvider } from '@k9-sak-web/gui/context/BehandlingContext.js';
import Uttak from './Uttak';
import {
  lagUtredBehandling,
  lagAvsluttetBehandling,
  lagUttak,
  lagOppfyltPeriode,
  lagIkkeOppfyltPeriode,
  lagInntektsgraderingPeriode,
  lagTilsynsgraderingPeriode,
  relevanteAksjonspunkterAlle,
  arbeidsgivereWithTilkommet,
  inntektsgraderingFlereArbeidsgivere,
  Årsak,
} from '@k9-sak-web/gui/storybook/mocks/uttak/uttakStoryMocks.js';
import { standardUttakHandlers } from '@k9-sak-web/gui/storybook/mocks/uttak/uttakMswHandlers.js';

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
  parameters: {
    msw: {
      handlers: [standardUttakHandlers.arbeidsgivere(), standardUttakHandlers.inntektsgradering()],
    },
  },
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
  parameters: {
    msw: {
      handlers: [standardUttakHandlers.arbeidsgivere(), standardUttakHandlers.inntektsgradering()],
    },
  },
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
    ]),
    erOverstyrer: false,
    aksjonspunkter: [],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Viser riktige perioder', async () => {
      await expect(
        canvas.getByRole('row', { name: '7 - 9 15.02.2024 - 28.02.2024 100% Søker 0 % Ny denne behandlingen' }),
      );
      await expect(
        canvas.getByRole('row', { name: '5 - 7 01.02.2024 - 14.02.2024 100% Søker 0 % Ny denne behandlingen' }),
      );
      await expect(
        canvas.getByRole('row', { name: '3 - 5 16.01.2024 - 31.01.2024 100% Søker 60 % Ny denne behandlingen' }),
      );
      await expect(
        canvas.getByRole('row', { name: '1 - 3 01.01.2024 - 15.01.2024 100% Søker 100 % Ny denne behandlingen' }),
      );
    });

    await step('Viser detaljer for uttaksperioder', async () => {
      const buttons = canvas.getAllByRole('button', { name: 'Åpne' });
      await expect(buttons.length).toEqual(4);

      await waitFor(async function sjekkFørstePeriode() {
        if (buttons[0]) {
          await user.click(buttons[0]);
        }
        await expect(
          canvas.getByRole('row', {
            name: 'Vilkår Medlemskap: Oppfylt Søknadsfrist: Oppfylt Opptjening: Oppfylt Omsorgen for: Ikke oppfylt Sykdom: Oppfylt Søkers alder: Oppfylt',
          }),
        );
      });

      await waitFor(async function sjekkAndrePeriode() {
        if (buttons[1]) await user.click(buttons[1]);

        await expect(
          canvas.getByRole('row', {
            name: 'Årsak for 0 % uttaksgrad: Tapt arbeidstid må være minst 20 %. Tapt arbeidstid regnes ut fra aktive arbeidsforhold, næringsaktivitet og frilansoppdrag. Gradering mot tilsyn Pleiebehov: 100 % - Etablert tilsyn: 0 % Mer informasjon - Andre søkeres tilsyn: 0 % = 100 % tilgjengelig til søker Gir lavest pleiepengegrad Gradering mot arbeidstid Bedrift AS (123456789) Normal arbeidstid: 7.5 timer Faktisk arbeidstid: 6.37 timer = 15.07 % fravær = 15% tapt arbeidstid',
          }),
        );
      });

      await waitFor(async function sjekkTredjePeriode() {
        if (buttons[2]) await user.click(buttons[2]);

        await expect(
          canvas.getByRole('row', {
            name: 'Gradering mot tilsyn Pleiebehov: 100 % - Etablert tilsyn: 0 % Mer informasjon - Andre søkeres tilsyn: 0 % = 100 % tilgjengelig til søker Gir lavest pleiepengegrad Gradering mot arbeidstid Bedrift AS (123456789) Normal arbeidstid: 7.5 timer Faktisk arbeidstid: 3 timer = 60.00 % fravær = 60% tapt arbeidstid',
          }),
        );
      });

      await waitFor(async function sjekkFjerdePeriode() {
        if (buttons[3]) await user.click(buttons[3]);

        await expect(
          canvas.getByRole('row', {
            name: 'Gradering mot tilsyn Pleiebehov: 100 % - Etablert tilsyn: 0 % Mer informasjon - Andre søkeres tilsyn: 0 % = 100 % tilgjengelig til søker Gradering mot arbeidstid Bedrift AS (123456789) Normal arbeidstid: 7.5 timer Faktisk arbeidstid: 0 timer = 100.00 % fravær = 100% tapt arbeidstid',
          }),
        );
      });

      if (buttons[3]) await user.click(buttons[3]);
    });
  },
};

/**
 * UttakGradertMotInntekt
 */
export const UttakGradertMotInntekt: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(arbeidsgivereWithTilkommet),
        standardUttakHandlers.inntektsgradering(inntektsgraderingFlereArbeidsgivere.perioder),
      ],
    },
  },
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
    const user = userEvent.setup();

    await step('Viser riktige perioder', async () => {
      await expect(
        canvas.getByRole('row', { name: '5 - 7 01.02.2024 - 14.02.2024 100% Søker 40 % Ny denne behandlingen' }),
      );
      await expect(
        canvas.getByRole('row', { name: '3 - 5 16.01.2024 - 31.01.2024 100% Søker 50 % Ny denne behandlingen' }),
      );
      await expect(
        canvas.getByRole('row', { name: '1 - 3 01.01.2024 - 15.01.2024 100% Søker 70 % Ny denne behandlingen' }),
      );
    });

    await step('Viser detaljer for uttaksperioder', async () => {
      const buttons = canvas.getAllByRole('button', { name: 'Åpne' });
      await expect(buttons.length).toEqual(3);

      if (buttons[0]) await user.click(buttons[0]);
      await waitFor(async function sjekkFørstePeriode() {
        await expect(
          canvas.getByRole('row', { name: /Gir lavest pleiepengegrad Gradering mot arbeidsinntekt/i }),
        ).toBeInTheDocument();
      });

      if (buttons[1]) await user.click(buttons[1]);
      await waitFor(async function sjekkAndrePeriode() {
        await expect(
          canvas.getByRole('row', { name: /Gir lavest pleiepengegrad Gradering mot arbeidsinntekt/i }),
        ).toBeInTheDocument();
      });

      if (buttons[2]) await user.click(buttons[2]);
      await waitFor(async function sjekkTredjePeriode() {
        await expect(
          canvas.getByRole('row', { name: /Gir lavest pleiepengegrad Gradering mot arbeidsinntekt/i }),
        ).toBeInTheDocument();
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
  parameters: {
    msw: {
      handlers: [standardUttakHandlers.arbeidsgivere(), standardUttakHandlers.inntektsgradering()],
    },
  },
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
    const user = userEvent.setup();

    await step('Viser riktige perioder', async () => {
      await expect(
        canvas.getByRole('row', { name: '7 - 9 15.02.2024 - 28.02.2024 100% Søker 25 % Ny denne behandlingen' }),
      );
      await expect(
        canvas.getByRole('row', { name: '5 - 7 01.02.2024 - 14.02.2024 100% Søker 50 % Ny denne behandlingen' }),
      );
      await expect(
        canvas.getByRole('row', { name: '3 - 5 16.01.2024 - 31.01.2024 100% Søker 60 % Ny denne behandlingen' }),
      );
      await expect(
        canvas.getByRole('row', { name: '1 - 3 01.01.2024 - 15.01.2024 100% Søker 70 % Ny denne behandlingen' }),
      );
    });

    await step('Viser detaljer for uttaksperioder', async () => {
      const buttons = canvas.getAllByRole('button', { name: 'Åpne' });
      await expect(buttons.length).toEqual(4);

      if (buttons[0]) await user.click(buttons[0]);
      await waitFor(async function sjekkFørstePeriode() {
        await expect(
          canvas.getByRole('row', {
            name: 'Gir lavest pleiepengegrad Gradering mot tilsyn Pleiebehov: 100 % - Etablert tilsyn: 40 % Mer informasjon - Andre søkeres tilsyn: 35 % = 25 % tilgjengelig til søker Gradering mot arbeidstid Bedrift AS (123456789) Normal arbeidstid: 7.5 timer Faktisk arbeidstid: 0 timer = 100.00 % fravær = 100% tapt arbeidstid',
          }),
        );
      });

      if (buttons[1]) await user.click(buttons[1]);
      await waitFor(async function sjekkAndrePeriode() {
        await expect(
          canvas.getByRole('row', {
            name: 'Gir lavest pleiepengegrad Gradering mot tilsyn Pleiebehov: 100 % - Etablert tilsyn: 50 % Mer informasjon - Andre søkeres tilsyn: 0 % = 50 % tilgjengelig til søker Gradering mot arbeidstid Bedrift AS (123456789) Normal arbeidstid: 7.5 timer Faktisk arbeidstid: 0 timer = 100.00 % fravær = 100% tapt arbeidstid',
          }),
        );
      });

      if (buttons[2]) await user.click(buttons[2]);
      await waitFor(async function sjekkTredjePeriode() {
        await expect(
          canvas.getByRole('row', {
            name: 'Gir lavest pleiepengegrad Gradering mot tilsyn Pleiebehov: 100 % - Etablert tilsyn: 20 % Mer informasjon - Andre søkeres tilsyn: 20 % = 60 % tilgjengelig til søker Gradering mot arbeidstid Bedrift AS (123456789) Normal arbeidstid: 7.5 timer Faktisk arbeidstid: 0 timer = 100.00 % fravær = 100% tapt arbeidstid',
          }),
        );
      });

      if (buttons[3]) await user.click(buttons[3]);
      await waitFor(async function sjekkFjerdePeriode() {
        await expect(
          canvas.getByRole('row', {
            name: 'Gir lavest pleiepengegrad Gradering mot tilsyn Pleiebehov: 100 % - Etablert tilsyn: 30 % Mer informasjon - Andre søkeres tilsyn: 0 % = 70 % tilgjengelig til søker Gradering mot arbeidstid Bedrift AS (123456789) Normal arbeidstid: 7.5 timer Faktisk arbeidstid: 0 timer = 100.00 % fravær = 100% tapt arbeidstid',
          }),
        );
      });

      if (buttons[3]) await user.click(buttons[3]);
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
  parameters: {
    msw: {
      handlers: [standardUttakHandlers.arbeidsgivere(), standardUttakHandlers.inntektsgradering()],
    },
  },
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
