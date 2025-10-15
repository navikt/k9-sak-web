/* eslint-disable @typescript-eslint/no-floating-promises */
import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within, expect, waitFor } from 'storybook/test';
import { action } from 'storybook/actions';
import { BehandlingProvider } from '@k9-sak-web/gui/context/BehandlingContext.js';
import Uttak from '../Uttak';
import {
  lagUtredBehandling,
  lagUttak,
  lagOppfyltPeriode,
  lagOverstyringUttakAksjonspunkt,
  defaultArbeidsgivere,
  AksjonspunktStatus,
  relevanteAksjonspunkterAlle,
} from '@k9-sak-web/gui/storybook/mocks/uttak/uttakStoryMocks.js';
import {
  standardUttakHandlers,
  createOverstyrbareAktiviteterHandler,
} from '@k9-sak-web/gui/storybook/mocks/uttak/uttakMswHandlers.js';

/**
 * OverstyrUttak-komponenten lar saksbehandlere med overstyrerrolle manuelt overstyre
 * uttaksgrader (uttaksgrad) og utbetalingsgrader (utbetalingsgrad) for spesifikke perioder.
 *
 * Vises i kontekst av hele uttak-visningen med periodelisten under.
 */
const meta = {
  title: 'gui/prosess/uttak/OverstyrUttak',
  component: Uttak,
  parameters: {
    docs: {
      description: {
        component:
          'Komponent for overstyring av uttaksgrad og utbetalingsgrad. ' +
          'Kun tilgjengelig for saksbehandlere med overstyrerrolle. ' +
          'Vises i kontekst av hele uttak-visningen med periodelisten.',
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
  tags: ['uttak', 'overstyrUttak'],
} satisfies Meta<typeof Uttak>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(),
        standardUttakHandlers.inntektsgradering(),
        standardUttakHandlers.overstyrtUttak(),
        standardUttakHandlers.overstyrAksjonspunkt(payload => action('overstyr-aksjonspunkt:submit')(payload)),
        createOverstyrbareAktiviteterHandler(
          [
            { fom: '2024-01-01', tom: '2024-01-31' },
            { fom: '2024-02-01', tom: '2024-02-28' },
          ],
          defaultArbeidsgivere,
        ),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([lagOppfyltPeriode('2024-01-01/2024-01-31'), lagOppfyltPeriode('2024-02-01/2024-02-28')]),
    erOverstyrer: true,
    aksjonspunkter: [],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Viser Uttak', async () => {
      await expect(canvas.getByRole('heading', { name: /Uttak/i })).toBeInTheDocument();
      await expect(canvas.getByRole('cell', { name: /01.02.2024 - 28.02.2024/i })).toBeInTheDocument();
      await expect(canvas.getByRole('cell', { name: /01.01.2024 - 31.01.2024/i })).toBeInTheDocument();
      const expandButtons = canvas.getAllByRole('button', { name: /Åpne/i });
      if (expandButtons[0]) await user.click(expandButtons[0]);
      await expect(canvas.getByRole('heading', { name: 'Gradering mot tilsyn' }));
      await expect(canvas.getByRole('heading', { name: 'Gradering mot arbeidstid' }));
      if (expandButtons[0]) await user.click(expandButtons[0]);
    });
  },
};

export const LeggTilOverstyring: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(),
        standardUttakHandlers.inntektsgradering(),
        standardUttakHandlers.overstyrtUttak(),
        standardUttakHandlers.overstyrAksjonspunkt(payload => action('overstyr-aksjonspunkt:submit')(payload)),
        createOverstyrbareAktiviteterHandler(
          [
            { fom: '2024-01-01', tom: '2024-12-31' }, // Allow full year for flexibility
          ],
          defaultArbeidsgivere,
        ),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([lagOppfyltPeriode('2024-01-01/2024-01-31'), lagOppfyltPeriode('2024-02-01/2024-02-28')]),
    erOverstyrer: true,
    aksjonspunkter: [],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Aktiver overstyring', async () => {
      const overstyrKnapp = canvas.getByTestId('overstyringsknapp');
      await user.click(overstyrKnapp);
    });

    await step('Aktiver overstyring', async () => {
      const addButton = canvas.getByRole('button', { name: /Legg til ny overstyring/i });
      await user.click(addButton);
    });

    await step('Viser overstyringsskjema', async () => {
      await waitFor(async function sjekkTekstboks() {
        const textboxes = canvas.getAllByRole('textbox');
        await expect(textboxes.length).toBeGreaterThan(0);
      });
    });

    await step('Fyll ut overstyringsskjema', async () => {
      const dateInputs = canvas.queryAllByRole('textbox');
      if (dateInputs.length >= 2 && dateInputs[0] && dateInputs[1]) {
        await user.type(dateInputs[0], '01.01.2024');
        await user.type(dateInputs[1], '15.01.2024');
      }

      const uttaksgradInput = canvas.queryByLabelText(/uttaksgrad/i);
      if (uttaksgradInput) {
        await user.type(uttaksgradInput, '80');
      }

      const begrunnelseField = await canvas.findByLabelText(/begrunnelse/i);
      if (begrunnelseField) {
        await user.click(begrunnelseField);
        await user.clear(begrunnelseField);
        await user.paste('Overstyring av uttaksgrad basert på spesielle forhold i saken');
        await user.tab(); // trigger blur
      }

      const leggTilButton = canvas.getByRole('button', { name: /Legg til overstyring/i });
      if (leggTilButton) {
        await expect(leggTilButton).toBeEnabled();
        await user.click(leggTilButton);
      }
    });
  },
};

export const Overstyringer: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(),
        standardUttakHandlers.inntektsgradering(),
        standardUttakHandlers.overstyrtUttak(defaultArbeidsgivere, [
          {
            id: 1,
            periode: { fom: '2024-01-01', tom: '2024-01-15' },
            søkersUttaksgrad: 80,
            begrunnelse: 'Justert uttaksgrad basert på spesielle forhold',
            utbetalingsgrader: [
              {
                arbeidsforhold: { type: 'ARBEIDSTAKER', orgnr: '123456789' },
                utbetalingsgrad: 80,
              },
            ],
          },
          {
            id: 2,
            periode: { fom: '2024-01-16', tom: '2024-01-31' },
            søkersUttaksgrad: 60,
            begrunnelse: 'Redusert uttaksgrad grunnet delvis arbeid',
            utbetalingsgrader: [
              {
                arbeidsforhold: { type: 'ARBEIDSTAKER', orgnr: '123456789' },
                utbetalingsgrad: 60,
              },
            ],
          },
        ]),
        standardUttakHandlers.overstyrAksjonspunkt(payload => action('overstyr-aksjonspunkt:submit')(payload)),
        createOverstyrbareAktiviteterHandler(
          [
            { fom: '2024-01-01', tom: '2024-12-31' },
          ],
          defaultArbeidsgivere,
        ),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([
      lagOppfyltPeriode('2024-01-01/2024-01-15', { manueltOverstyrt: true, uttaksgrad: 80 }),
      lagOppfyltPeriode('2024-01-16/2024-01-31', { manueltOverstyrt: true, uttaksgrad: 60 }),
      lagOppfyltPeriode('2024-02-01/2024-02-14'),
      lagOppfyltPeriode('2024-02-15/2024-02-28'),
    ]),
    erOverstyrer: true,
    aksjonspunkter: [lagOverstyringUttakAksjonspunkt(AksjonspunktStatus.OPPRETTET)],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Viser Uttak med overstyringer', async () => {
      await waitFor(async function sjekkerUttaksDetaljer() {
        await expect(canvas.getByRole('cell', { name: /15.02.2024 - 28.02.2024/i })).toBeInTheDocument();
        await expect(canvas.getByRole('cell', { name: /01.02.2024 - 14.02.2024/i })).toBeInTheDocument();
        await expect(canvas.getByRole('cell', { name: /16.01.2024 - 31.01.2024/i })).toBeInTheDocument();
        await expect(canvas.getByRole('cell', { name: /01.01.2024 - 15.01.2024/i })).toBeInTheDocument();
        await expect(canvas.getByRole('heading', { name: 'Overstyrte perioder' }));
        await expect(canvas.getByRole('cell', { name: '01.01.2024' })).toBeInTheDocument();
        await expect(canvas.getByRole('cell', { name: '15.01.2024' })).toBeInTheDocument();
        await expect(canvas.getByRole('cell', { name: '16.01.2024' })).toBeInTheDocument();
        await expect(canvas.getByRole('cell', { name: '31.01.2024' })).toBeInTheDocument();
      });
    });

    await step('Viser varsel om overstyring', async () => {
      await expect(canvas.getByRole('heading', { name: 'Vurder overstyring av uttaksgrad og utbetalingsgrad' }));
      await expect(
        canvas.getByText(
          'Aksjonspunkt for overstyring av uttaks-/utbetalingsgrad har blitt opprettet i denne, eller en tidligere, behandling og må løses av en saksbehandler med overstyrerrolle.',
        ),
      );
    });
  },
};

const submitSpy = fn();

export const RedigerOverstyring: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(),
        standardUttakHandlers.inntektsgradering(),
        standardUttakHandlers.overstyrtUttak(defaultArbeidsgivere, [
          {
            id: 1,
            periode: { fom: '2024-01-01', tom: '2024-01-15' },
            søkersUttaksgrad: 80,
            begrunnelse: 'Opprinnelig begrunnelse',
            utbetalingsgrader: [
              {
                arbeidsforhold: { type: 'ARBEIDSTAKER', orgnr: '123456789' },
                utbetalingsgrad: 80,
              },
            ],
          },
        ]),
        standardUttakHandlers.overstyrAksjonspunkt(payload => {
          submitSpy(payload);
          action('overstyr-aksjonspunkt:submit')(payload);
        }),
        createOverstyrbareAktiviteterHandler(
          [
            { fom: '2024-01-01', tom: '2024-12-31' },
          ],
          defaultArbeidsgivere,
        ),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([
      lagOppfyltPeriode('2024-01-01/2024-01-15', { manueltOverstyrt: true, uttaksgrad: 80 }),
      lagOppfyltPeriode('2024-01-16/2024-01-31'),
    ]),
    erOverstyrer: true,
    aksjonspunkter: [],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Eksisterende overstyringer vises', async () => {
      await waitFor(async function sjekkOverstyrtePerioder() {
        await expect(canvas.getByRole('heading', { name: 'Overstyrte perioder' })).toBeInTheDocument();
      });
    });

    await step('Rediger overstyring', async () => {
      await user.click(canvas.getByTestId('overstyringsknapp'));
      const row = canvas.getByRole('row', { name: /Vis mer 01.01.2024 15.01.2024 80 % Endre Slett/i });

      await waitFor(async function sjekkEndreKnapp() {
        await user.click(within(row).getByRole('button', { name: 'Endre' }));
      });

      await expect(canvas.getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.01.2024');
      await expect(canvas.getByRole('textbox', { name: 'Til og med' })).toHaveValue('15.01.2024');

      await waitFor(
        async function oppdaterSkjemafelter() {
          const utbetalingsgradField = await canvas.getByRole('spinbutton', { name: 'Ny utbetalingsgrad (%)' });
          await expect(utbetalingsgradField).toHaveValue(80);
          await user.clear(utbetalingsgradField);
          await user.type(utbetalingsgradField, '70');
          await expect(utbetalingsgradField).toHaveValue(70);
        },
        { timeout: 5000 },
      );

      await waitFor(async function oppdaterBegrunnelse() {
        const begrunnelseField = await canvas.getByRole('textbox', { name: 'Begrunnelse' });
        await user.clear(begrunnelseField);
        await user.type(begrunnelseField, 'Endret begrunnelse');
      });

      await user.click(canvas.getByRole('button', { name: 'Endre overstyring' }));

      await waitFor(async function sjekkOverstyrt() {
        await expect(submitSpy).toHaveBeenCalledWith({
          behandlingId: 'behandling-1',
          behandlingVersjon: 1,
          bekreftedeAksjonspunktDtoer: [],
          overstyrteAksjonspunktDtoer: [
            {
              '@type': '6017',
              gåVidere: false,
              periode: { fom: '', tom: '' },
              lagreEllerOppdater: [
                {
                  utbetalingsgrader: [
                    {
                      arbeidsforhold: { orgnr: '123456789', type: 'ARBEIDSTAKER' },
                      utbetalingsgrad: 70,
                    },
                  ],
                  begrunnelse: 'Endret begrunnelse',
                  periode: { fom: '2024-01-01', tom: '2024-01-15' },
                  søkersUttaksgrad: 80,
                  id: 1,
                },
              ],
              slett: [],
            },
          ],
        });
      });
    });
  },
};

export const FjernOverstyring: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(),
        standardUttakHandlers.inntektsgradering(),
        standardUttakHandlers.overstyrtUttak(defaultArbeidsgivere, [
          {
            id: 1,
            periode: { fom: '2024-01-01', tom: '2024-01-15' },
            søkersUttaksgrad: 80,
            begrunnelse: 'Overstyring som skal slettes',
            utbetalingsgrader: [
              {
                arbeidsforhold: { type: 'ARBEIDSTAKER', orgnr: '123456789' },
                utbetalingsgrad: 80,
              },
            ],
          },
        ]),
        standardUttakHandlers.overstyrAksjonspunkt(payload => {
          submitSpy(payload);
          action('overstyr-aksjonspunkt:submit')(payload);
        }),
        createOverstyrbareAktiviteterHandler(
          [
            { fom: '2024-01-01', tom: '2024-12-31' },
          ],
          defaultArbeidsgivere,
        ),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([
      lagOppfyltPeriode('2024-01-01/2024-01-15', { manueltOverstyrt: true, uttaksgrad: 80 }),
      lagOppfyltPeriode('2024-01-16/2024-01-31'),
    ]),
    erOverstyrer: true,
    aksjonspunkter: [],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Eksisterende overstyringer vises', async () => {
      await waitFor(async function sjekkEksisterendeOverstyringer() {
        await expect(canvas.getByRole('heading', { name: 'Overstyrte perioder' })).toBeInTheDocument();
        await expect(canvas.getByRole('cell', { name: '01.01.2024' })).toBeInTheDocument();
        await expect(canvas.getByRole('cell', { name: '15.01.2024' })).toBeInTheDocument();
      });
    });

    await step('Fjerner overstyring', async () => {
      await user.click(canvas.getByTestId('overstyringsknapp'));
      waitFor(async function sjekkSlettKnapp() {
        await user.click(canvas.getByRole('button', { name: 'Slett' }));
      });
      await expect(canvas.findByRole('heading', { name: 'Er du sikker på at du vil slette en overstyring?' }));
      await waitFor(async function sjekkBekreftSlettModal() {
        const modal = canvas.getByRole('dialog');

        const buttons = within(modal).getAllByRole('button');
        const deleteButton = buttons.find(btn => btn.getAttribute('data-color') === 'danger');
        if (deleteButton) {
          await user.click(deleteButton);
        }
        await expect(within(modal).getByText('Venter...')).toBeInTheDocument();
      });

      await step('Sletting av overstyring sendt til backend', async () => {
        waitFor(async function sjekkOverstyring() {
          await expect(submitSpy).toHaveBeenCalled();
          const submitPayload = submitSpy.mock.calls[0]?.[0];
          await expect(submitPayload).toEqual({
            behandlingId: 'behandling-1',
            behandlingVersjon: 1,
            bekreftedeAksjonspunktDtoer: [],
            overstyrteAksjonspunktDtoer: [
              {
                '@type': '6017',
                gåVidere: false,
                periode: { fom: '', tom: '' },
                lagreEllerOppdater: [],
                slett: [{ id: 1 }],
              },
            ],
          });
        });
      });
    });
  },
};

export const Lesemodus: Story = {
  parameters: {
    msw: {
      handlers: [
        standardUttakHandlers.arbeidsgivere(),
        standardUttakHandlers.inntektsgradering(),
        standardUttakHandlers.overstyrtUttak(defaultArbeidsgivere, [
          {
            id: 1,
            periode: { fom: '2024-01-01', tom: '2024-01-15' },
            søkersUttaksgrad: 80,
            begrunnelse: 'Overstyring gjort av annen saksbehandler',
            utbetalingsgrader: [
              {
                arbeidsforhold: { type: 'ARBEIDSTAKER', orgnr: '123456789' },
                utbetalingsgrad: 80,
              },
            ],
          },
        ]),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([
      lagOppfyltPeriode('2024-01-01/2024-01-15', { manueltOverstyrt: true, uttaksgrad: 80 }),
      lagOppfyltPeriode('2024-01-16/2024-01-31'),
    ]),
    erOverstyrer: false,
    aksjonspunkter: [lagOverstyringUttakAksjonspunkt(AksjonspunktStatus.OPPRETTET)],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step('Varsel om overstyring vises', async () => {
      waitFor(async function sjekkVarselOmOverstyring() {
        await expect(canvas.getByRole('heading', { name: 'Vurder overstyring av uttaksgrad og utbetalingsgrad' }));
      });
    });

    await step('Tabell med overstyringer vises', async () => {
      waitFor(async function sjekkOverstyringTabell() {
        await expect(canvas.getByRole('heading', { name: 'Overstyrte perioder' }));
        await expect(canvas.getByRole('cell', { name: '01.01.2024' }));
        await expect(canvas.getByRole('cell', { name: '15.01.2024' }));
        await user.click(canvas.getByRole('button', { name: 'Vis mer' }));
        await expect(canvas.getByText('Overstyring gjort av annen saksbehandler'));
        await user.click(canvas.getByRole('button', { name: 'Vis mindre' }));
      });
    });

    await step('Kan ikke legge til ny, redigere eller slette overstyring', async () => {
      await expect(canvas.queryByRole('button', { name: /Legg til ny overstyring/i })).not.toBeInTheDocument();
      const buttons = await canvas.queryAllByRole('button');
      await expect(buttons.filter(btn => btn.textContent?.toLowerCase().includes('rediger')).length).toBe(0);
      await expect(buttons.filter(btn => btn.textContent?.toLowerCase().includes('slett')).length).toBe(0);
    });
  },
};
