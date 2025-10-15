/**
 * VurderOverlappendeSak komponent stories.
 *
 * Denne komponenten håndterer vurdering av overlappende søskensaker hvor flere
 * søknader eksisterer for samme barn i overlappende tidsperioder. Saksbehandlere
 * må vurdere disse overlappene og potensielt dele perioder for å sikre korrekt
 * ytelsesfordeling mellom søkerne.
 *
 * Nøkkelscenarier som testes:
 * - Visning av overlappende perioder fra søskensaker
 * - Deling av perioder for å løse overlapp
 * - Innsending av vurderinger med begrunnelser
 * - Skjemavalidering
 * - Skrivebeskyttet modus for fullførte vurderinger
 */
import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within, expect, waitFor, fireEvent } from 'storybook/test';
import { action } from 'storybook/actions';
import dayjs from 'dayjs';
import { BehandlingProvider } from '@k9-sak-web/gui/context/BehandlingContext.js';
import Uttak from '../Uttak';
import {
  lagUtredBehandling,
  lagAvsluttetBehandling,
  lagUttak,
  lagOppfyltPeriode,
  lagOverlappendeSakerAksjonspunkt,
  lagOverlappendePeriode,
  AksjonspunktStatus,
  relevanteAksjonspunkterAlle,
} from '@k9-sak-web/gui/storybook/mocks/uttak/uttakStoryMocks.js';
import {
  lagRelativePerioder,
  beregnSplittDatoer,
  tilIsoDato,
  tilVisningsDato,
} from '@k9-sak-web/gui/storybook/mocks/uttak/uttakTestHelpers.js';
import {
  standardUttakHandlers,
  createOverlappendeSakerHandler,
} from '@k9-sak-web/gui/storybook/mocks/uttak/uttakMswHandlers.js';

dayjs.locale('nb');

const { periode1, periode2 } = lagRelativePerioder();
const fom1 = periode1.fom;
const tom1 = periode1.tom;
const fom2 = periode2.fom;
const tom2 = periode2.tom;
const { splittFom, splittTom } = beregnSplittDatoer(fom1);

/**
 * VurderOverlappendeSak-komponenten håndterer vurdering av overlappende søskensaker.
 * Vises i kontekst av hele uttak-visningen.
 */
const meta = {
  title: 'gui/prosess/Uttak/Overlappende-Saker',
  component: Uttak,
  parameters: {
    docs: {
      description: {
        component:
          'Komponent for vurdering av overlappende søskensaker hvor flere søknader eksisterer for samme barn i overlappende tidsperioder.',
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
  beforeEach: () => {
    submitSpy.mockClear();
  },
  tags: ['vurderOverlappendeSak', 'uttak'],
} satisfies Meta<typeof Uttak>;

export default meta;

type Story = StoryObj<typeof meta>;

const submitSpy = fn();

export const Aksjonspunkt: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(),
        standardUttakHandlers.inntektsgradering(),
        standardUttakHandlers.overstyrtUttak(),
        createOverlappendeSakerHandler([
          lagOverlappendePeriode(tilIsoDato(fom1), tilIsoDato(tom1), ['ABCDE']),
          lagOverlappendePeriode(tilIsoDato(fom2), tilIsoDato(tom2), ['FGHIJ']),
        ]),
        standardUttakHandlers.aksjonspunkt(payload => action('aksjonspunkt:submit')(payload)),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([lagOppfyltPeriode('2024-01-01/2024-01-31'), lagOppfyltPeriode('2024-02-01/2024-02-28')]),
    erOverstyrer: false,
    aksjonspunkter: [lagOverlappendeSakerAksjonspunkt()],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Viser infoboks med overlappende perioder', async () => {
      await expect(canvas.findByRole('heading', { name: 'Uttaksgrad for overlappende perioder' })).resolves.toBeInTheDocument();
      await expect(canvas.findByText('Perioder som overlapper med sak:')).resolves.toBeInTheDocument();
      await expect(canvas.findByRole('link', { name: 'ABCDE' })).resolves.toBeInTheDocument();
      await expect(canvas.findByRole('link', { name: 'FGHIJ' })).resolves.toBeInTheDocument();
    });

    await step('Viser skjema for vurdering av overlappende perioder', async () => {
      const gruppeEnNavn = `Vurder uttak i denne saken for perioden ${tilVisningsDato(fom1)} - ${tilVisningsDato(tom1)} Splitt periode`;
      const gruppeToNavn = `Vurder uttak i denne saken for perioden ${tilVisningsDato(fom2)} - ${tilVisningsDato(tom2)} Splitt periode`;

      const gruppeEn = within(canvas.getByRole('group', { name: gruppeEnNavn }));
      const gruppeTo = within(canvas.getByRole('group', { name: gruppeToNavn }));

      await expect(gruppeEn.findByRole('radio', { name: 'Ingen uttak i perioden' })).resolves.toBeInTheDocument();
      await expect(gruppeEn.findByRole('radio', { name: 'Vanlig uttak i perioden' })).resolves.toBeInTheDocument();
      await expect(gruppeTo.findByRole('radio', { name: 'Tilpass uttaksgrad' })).resolves.toBeInTheDocument();
      await expect(canvas.findByRole('button', { name: 'Bekreft og fortsett' })).resolves.toBeInTheDocument();
    });
  },
};

export const LøsAksjonspunkt: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(),
        standardUttakHandlers.inntektsgradering(),
        standardUttakHandlers.overstyrtUttak(),
        createOverlappendeSakerHandler([
          lagOverlappendePeriode(tilIsoDato(fom1), tilIsoDato(tom1), ['ABCDE']),
          lagOverlappendePeriode(tilIsoDato(fom2), tilIsoDato(tom2), ['FGHIJ']),
        ]),
        standardUttakHandlers.aksjonspunkt(payload => {
          submitSpy(payload);
          action('aksjonspunkt:submit')(payload);
        }),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([lagOppfyltPeriode('2024-01-01/2024-01-31'), lagOppfyltPeriode('2024-02-01/2024-02-28')]),
    erOverstyrer: false,
    aksjonspunkter: [lagOverlappendeSakerAksjonspunkt()],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    await step('Fyll ut skjema for overlappende perioder', async () => {
      await waitFor(async function redigerSkjema() {
        const gruppeEnNavn = `Vurder uttak i denne saken for perioden ${tilVisningsDato(fom1)} - ${tilVisningsDato(tom1)} Splitt periode`;
        const gruppeToNavn = `Vurder uttak i denne saken for perioden ${tilVisningsDato(fom2)} - ${tilVisningsDato(tom2)} Splitt periode`;

        const gruppeEn = within(canvas.getByRole('group', { name: gruppeEnNavn }));
        const gruppeTo = within(canvas.getByRole('group', { name: gruppeToNavn }));

        await user.click(await gruppeEn.findByRole('radio', { name: 'Tilpass uttaksgrad' }));
        await user.type(
          await canvas.findByRole('textbox', { name: 'Sett uttaksgrad for perioden (i prosent)' }),
          '40',
        );

        await user.click(await gruppeTo.findByRole('radio', { name: 'Tilpass uttaksgrad' }));
        const felt2 = (await canvas.findAllByRole('textbox', { name: 'Sett uttaksgrad for perioden (i prosent)' }))[1];
        if (felt2) {
          await user.type(felt2, '60');
        }
        await user.type(
          await canvas.findByLabelText('Begrunnelse'),
          'Dette er en grundig begrunnelse',
        );
        
      });
    });

    await step('Bekreft og send inn', async () => {
      await user.click(await canvas.findByRole('button', { name: 'Bekreft og fortsett' }));

      await waitFor(async function sjekkFørstePeriode() {
        await expect(submitSpy).toHaveBeenCalledWith(
          await expect.objectContaining({
            behandlingId: '1',
            behandlingVersjon: 1,
            bekreftedeAksjonspunktDtoer: await expect.arrayContaining([
              await expect.objectContaining({
                '@type': '9292',
                begrunnelse: 'Dette er en grundig begrunnelse',
                perioder: await expect.arrayContaining([
                  await expect.objectContaining({
                    valg: 'JUSTERT_GRAD',
                    søkersUttaksgrad: 40,
                  }),
                  await expect.objectContaining({
                    valg: 'JUSTERT_GRAD',
                    søkersUttaksgrad: 60,
                  }),
                ]),
              }),
            ]),
          }),
        );
      });

    });
  },
};

export const LøsAksjonspunktMedSplitt: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(),
        standardUttakHandlers.inntektsgradering(),
        standardUttakHandlers.overstyrtUttak(),
        createOverlappendeSakerHandler([
          lagOverlappendePeriode(tilIsoDato(fom1), tilIsoDato(tom1), ['ABCDE']),
          lagOverlappendePeriode(tilIsoDato(fom2), tilIsoDato(tom2), ['FGHIJ']),
        ]),
        standardUttakHandlers.aksjonspunkt(payload => {
          submitSpy(payload);
          action('aksjonspunkt:submit')(payload);
        }),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([lagOppfyltPeriode('2024-01-01/2024-01-31'), lagOppfyltPeriode('2024-02-01/2024-02-28')]),
    erOverstyrer: false,
    aksjonspunkter: [lagOverlappendeSakerAksjonspunkt()],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    await step('Åpne splitt periode dialog', async () => {
      await waitFor(async function velgGruppeEn() {
        const gruppeEnNavn = `Vurder uttak i denne saken for perioden ${tilVisningsDato(fom1)} - ${tilVisningsDato(tom1)} Splitt periode`;
        const gruppeEn = within(canvas.getByRole('group', { name: gruppeEnNavn }));

        await user.click(await gruppeEn.findByRole('radio', { name: 'Tilpass uttaksgrad' }));
        await fireEvent.change(
          await canvas.findByRole('textbox', { name: 'Sett uttaksgrad for perioden (i prosent)' }),
          { target: { value: '40' } },
        );
        await user.click(await gruppeEn.findByRole('button', { name: 'Splitt periode' }));
        await expect(canvas.findByRole('grid', { name: `${fom1.format('MMMM YYYY')}` })).resolves.toBeInTheDocument();
      });
    });

    await step('Velg periode for splitting', async () => {
      if (splittFom.isAfter(fom1, 'month')) {
        await user.click(await canvas.findByRole('button', { name: `Gå til neste måned` }));
      }

      await user.click(await canvas.findByRole('button', { name: `${splittFom.format('dddd D')}` }));

      if (splittTom.isAfter(splittFom, 'month')) {
        await user.click(await canvas.findByRole('button', { name: `Gå til neste måned` }));
      }

      const splittTomButton = await canvas.findByRole('button', { name: `${splittTom.format('dddd D')}` });
      if (splittTomButton.className.includes('rdp-day_disabled')) {
        await user.click(await canvas.findByRole('button', { name: `Gå til neste måned` }));
        await user.click(await canvas.findByRole('button', { name: `${splittTom.format('dddd D')}` }));
      } else {
        await user.click(splittTomButton);
      }

      // Verifiser at periodene er splittet - bruker RegExp for å matche uten "Splitt periode" knappen
      await expect(
        canvas.findByRole('group', {
          name: new RegExp(`Vurder uttak i denne saken for perioden ${tilVisningsDato(fom1)} - ${tilVisningsDato(splittFom.subtract(1, 'day'))}`, 'i'),
        }),
      ).resolves.toBeInTheDocument();
    });

    await step('Fyll ut og send inn', async () => {
      const gruppeToNavn = `Vurder uttak i denne saken for perioden ${tilVisningsDato(fom2)} - ${tilVisningsDato(tom2)} Splitt periode`;
      const gruppeTo = within(canvas.getByRole('group', { name: gruppeToNavn }));
      await user.click(await gruppeTo.findByRole('radio', { name: 'Vanlig uttak i perioden' }));

      await fireEvent.change(await canvas.findByLabelText('Begrunnelse'), {
        target: { value: 'Dette er en grundig begrunnelse' },
      });

      await user.click(await canvas.findByRole('button', { name: 'Bekreft og fortsett' }));

      await waitFor(async function sjekkAksjonspunkt() {
        await expect(submitSpy).toHaveBeenCalled();
      });
    });
  },
};

export const LøstAksjonspunkt: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(),
        standardUttakHandlers.inntektsgradering(),
        standardUttakHandlers.overstyrtUttak(),
        createOverlappendeSakerHandler([
          lagOverlappendePeriode(tilIsoDato(fom1), tilIsoDato(tom1), ['ABCDE'], {
            fastsattUttaksgrad: 60.0,
            saksbehandler: 'Sara Sak',
            vurdertTidspunkt: dayjs().subtract(2, 'day').toISOString(),
            valg: 'JUSTERT_GRAD',
          }),
          lagOverlappendePeriode(tilIsoDato(fom2), tilIsoDato(tom2), ['FGHIJ'], {
            fastsattUttaksgrad: 70.0,
            saksbehandler: 'Sara Sak',
            valg: 'JUSTERT_GRAD',
            vurdertTidspunkt: dayjs().subtract(2, 'day').toISOString(),
          }),
        ]),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([lagOppfyltPeriode('2024-01-01/2024-01-31'), lagOppfyltPeriode('2024-02-01/2024-02-28')]),
    erOverstyrer: false,
    aksjonspunkter: [lagOverlappendeSakerAksjonspunkt(AksjonspunktStatus.UTFØRT, { begrunnelse: 'Dette er en grundig begrunnelse' })],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
};

export const LøstAksjonspunktKanRedigeres: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(),
        standardUttakHandlers.inntektsgradering(),
        standardUttakHandlers.overstyrtUttak(),
        createOverlappendeSakerHandler([
          lagOverlappendePeriode(tilIsoDato(fom1), tilIsoDato(tom1), ['ABCDE'], {
            fastsattUttaksgrad: 50.0,
            saksbehandler: 'Sara Sak',
            vurdertTidspunkt: dayjs().subtract(2, 'day').toISOString(),
            valg: 'JUSTERT_GRAD',
          }),
          lagOverlappendePeriode(tilIsoDato(fom2), tilIsoDato(tom2), ['FGHIJ'], {
            fastsattUttaksgrad: 30.0,
            saksbehandler: 'Sara Sak',
            valg: 'JUSTERT_GRAD',
            vurdertTidspunkt: dayjs().subtract(2, 'day').toISOString(),
          }),
        ]),
        standardUttakHandlers.aksjonspunkt(payload => {
          submitSpy(payload);
          action('aksjonspunkt:submit')(payload);
        }),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([lagOppfyltPeriode('2024-01-01/2024-01-31'), lagOppfyltPeriode('2024-02-01/2024-02-28')]),
    erOverstyrer: false,
    aksjonspunkter: [
      lagOverlappendeSakerAksjonspunkt(AksjonspunktStatus.UTFØRT, {
        begrunnelse: 'Dette er en grundig begrunnelse',
        erAktivt: true, // Må være true for å kunne redigeres
      }),
    ],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);

    await step('Viser lesevisning av løst aksjonspunkt', async () => {
      await expect(canvas.findByRole('heading', { name: 'Uttaksgrad for overlappende perioder' })).resolves.toBeInTheDocument();

      const radios = await canvas.findAllByRole('radio', { name: 'Tilpass uttaksgrad' });
      radios.forEach(async radio => {
        await expect(radio).toBeChecked();
      });

      await expect(canvas.findByDisplayValue('50')).resolves.toHaveAttribute('readonly');
      await expect(canvas.findByDisplayValue('30')).resolves.toHaveAttribute('readonly');
      await expect(canvas.findByRole('textbox', { name: 'Begrunnelse' })).resolves.toHaveAttribute('readonly');
    });

    await step('Kan redigere aksjonspunkt', async () => {
      await user.click(await canvas.findByRole('button', { name: 'Rediger' }));

      const gruppeEn = canvas.getByRole('group', { name: new RegExp(`Vurder uttak i denne saken for perioden ${tilVisningsDato(fom1)} - ${tilVisningsDato(tom1)}`, 'i') })
      const gruppeTo = canvas.getByRole('group', { name: new RegExp(`Vurder uttak i denne saken for perioden ${tilVisningsDato(fom2)} - ${tilVisningsDato(tom2)}`, 'i') })

      const begrunnelseFelt = await canvas.findByLabelText('Begrunnelse');

      await user.click(within(gruppeEn).getByRole('radio', { name: 'Vanlig uttak i perioden' }));
      await user.click(within(gruppeTo).getByRole('radio', { name: 'Ingen uttak i perioden' }));

      await user.clear(begrunnelseFelt);
      await user.type(
        begrunnelseFelt,
        'Dette er en modifisert begrunnelse',
      );
    });

    await step('Kan lagre aksjonspunkt', async () => {
      await user.click(await canvas.findByRole('button', { name: 'Bekreft og fortsett' }));

      await waitFor(async function sjekkAksjonspunkt() {
        await expect(submitSpy).toHaveBeenCalledWith(
          await expect.objectContaining({
            behandlingId: '1',
            behandlingVersjon: 1,
            bekreftedeAksjonspunktDtoer: await expect.arrayContaining([
              await expect.objectContaining({
                '@type': '9292',
                begrunnelse: 'Dette er en modifisert begrunnelse',
                perioder: await expect.arrayContaining([
                  await expect.objectContaining({
                    begrunnelse: 'Dette er en modifisert begrunnelse',
                    periode: {
                      fom: tilIsoDato(fom1),
                      tom: tilIsoDato(tom1),
                    },
                    valg: 'INGEN_JUSTERING',
                  }),
                  await expect.objectContaining({
                    begrunnelse: 'Dette er en modifisert begrunnelse',
                    periode: {
                      fom: tilIsoDato(fom2),
                      tom: tilIsoDato(tom2),
                    },
                    valg: 'INGEN_UTTAK_I_PERIODEN',
                    søkersUttaksgrad: 0,
                  }),
                ]),
              }),
            ]),
          }),
        );
      });
    });
  },
};

export const LøstAksjonspunktAvsluttetSak: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(),
        standardUttakHandlers.inntektsgradering(),
        standardUttakHandlers.overstyrtUttak(),
        createOverlappendeSakerHandler([
          lagOverlappendePeriode(tilIsoDato(fom1), tilIsoDato(tom1), ['ABCDE'], {
            fastsattUttaksgrad: 60.0,
            saksbehandler: 'Sara Sak',
            vurdertTidspunkt: dayjs().subtract(2, 'day').toISOString(),
            valg: 'JUSTERT_GRAD',
          }),
          lagOverlappendePeriode(tilIsoDato(fom2), tilIsoDato(tom2), ['FGHIJ'], {
            fastsattUttaksgrad: 70.0,
            saksbehandler: 'Sara Sak',
            valg: 'JUSTERT_GRAD',
            vurdertTidspunkt: dayjs().subtract(2, 'day').toISOString(),
          }),
        ]),
      ],
    },
  },
  args: {
    behandling: lagAvsluttetBehandling(),
    uttak: lagUttak([lagOppfyltPeriode('2024-01-01/2024-01-31'), lagOppfyltPeriode('2024-02-01/2024-02-28')]),
    erOverstyrer: false,
    aksjonspunkter: [lagOverlappendeSakerAksjonspunkt(AksjonspunktStatus.UTFØRT, { begrunnelse: 'Dette er en grundig begrunnelse' })],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Viser leseversjon i avsluttet sak', async () => {
      await expect(canvas.findByRole('heading', { name: 'Uttaksgrad for overlappende perioder' })).resolves.toBeInTheDocument();

      const radios = await canvas.findAllByRole('radio', { name: 'Tilpass uttaksgrad' });
      radios.forEach(async radio => {
        await expect(radio).toBeChecked();
      });

      await expect(canvas.findByDisplayValue('60')).resolves.toHaveAttribute('readonly');
      await expect(canvas.findByDisplayValue('70')).resolves.toHaveAttribute('readonly');

      await expect(canvas.queryByRole('button', { name: 'Rediger' })).not.toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    });
  },
};
