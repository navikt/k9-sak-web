import type { Meta, StoryObj } from '@storybook/react';
import { fn, within, userEvent, expect, waitFor } from 'storybook/test';
import { action } from 'storybook/actions';
import { http, HttpResponse } from 'msw';
import { BehandlingProvider } from '@k9-sak-web/gui/context/BehandlingContext.js';
import Uttak from '../Uttak';
import {
  lagUtredBehandling,
  lagUttak,
  lagOppfyltPeriode,
  lagVurderDatoNyRegelAksjonspunkt,
  AksjonspunktStatus,
  defaultArbeidsgivere,
  relevanteAksjonspunkterAlle,
} from '@k9-sak-web/gui/storybook/mocks/uttak/uttakStoryMocks.js';

/**
 * VurderDato-komponenten håndterer vurdering av virkningsdato for nye uttaksregler.
 * Vises i kontekst av hele uttak-visningen.
 */
const meta = {
  title: 'gui/prosess/Uttak/VurderDato',
  component: Uttak,
  parameters: {
    docs: {
      description: {
        component:
          'Komponent for vurdering av dato for nye uttaksregler. ' +
          'Viser informasjon om regelendringer og lar saksbehandler velge virkningsdato.',
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
  tags: ['vurderDato', 'uttak'],
} satisfies Meta<typeof Uttak>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ÅpentAksjonspunkt: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/behandling/arbeidsgiver', () => {
          return HttpResponse.json({ arbeidsgivere: defaultArbeidsgivere });
        }),
        http.get('*/api/behandling/pleiepenger/inntektsgradering', () => {
          return HttpResponse.json({ perioder: [] });
        }),
        http.get('*/api/behandling/pleiepenger/uttak/overstyrt', () => {
          return HttpResponse.json({
            arbeidsgiverOversikt: { arbeidsgivere: defaultArbeidsgivere },
            overstyringer: [],
          });
        }),
        http.post('*/api/behandling/aksjonspunkt', async ({ request }) => {
          const payload = await request.json().catch(() => undefined);
          action('aksjonspunkt:submit')(payload);
          return HttpResponse.json({ status: 'OK', mottatt: payload });
        }),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak(
      [lagOppfyltPeriode('2024-01-01/2024-01-15'), lagOppfyltPeriode('2024-01-16/2024-01-31')],
    ),
    erOverstyrer: false,
    aksjonspunkter: [lagVurderDatoNyRegelAksjonspunkt()],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Viser advarsel', async () => {
      await expect(canvas.getByText('Vurder hvilken dato endringer i uttak skal gjelde fra')).toBeInTheDocument();
    });

    await step('Viser informasjon om endringene i uttak', async () => {
      await expect(canvas.getByText('Hva innebærer endringene i uttak?')).toBeInTheDocument();

      await waitFor(async function ekspanderInformasjonOmEndringer() {
        await user.click(canvas.getByRole('button', { name: /Hva innebærer endringene i uttak/i }))
        await expect(canvas.getByText(/Før endring:/i)).toBeVisible();
      });

      await waitFor(async function skjulInformasjonOmEndringer() {
        await user.click(canvas.getByRole('button', { name: /Hva innebærer endringene i uttak/i }))
        await expect(canvas.getByText(/Før endring:/i)).not.toBeVisible();
      });
    });

    await step('Viser tomt aksjonspunkt', async () => {
      expect(canvas.getByLabelText('Begrunnelse')).toHaveValue('');
      await waitFor(async function bekreftOgFortsett() {
        expect(canvas.getByRole('button', { name: /Bekreft og fortsett/i })).toBeVisible();
      });
    });
  },
};

export const Skjemavalidering: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/behandling/arbeidsgiver', () => {
          return HttpResponse.json({ arbeidsgivere: defaultArbeidsgivere });
        }),
        http.get('*/api/behandling/pleiepenger/inntektsgradering', () => {
          return HttpResponse.json({ perioder: [] });
        }),
        http.get('*/api/behandling/pleiepenger/uttak/overstyrt', () => {
          return HttpResponse.json({
            arbeidsgiverOversikt: { arbeidsgivere: defaultArbeidsgivere },
            overstyringer: [],
          });
        }),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak(
      [lagOppfyltPeriode('2024-01-01/2024-01-15'), lagOppfyltPeriode('2024-01-16/2024-01-31')],
    ),
    erOverstyrer: false,
    aksjonspunkter: [lagVurderDatoNyRegelAksjonspunkt()],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    const begrunnelseField = canvas.getByLabelText('Begrunnelse');

    await step('For kort begrunnelse', async () => {
      await user.clear(begrunnelseField);
      await user.type(begrunnelseField, 'Test');
      await user.click(canvas.getByRole('button', { name: /Bekreft og fortsett/i }));
      await expect(canvas.getByText(/Du må skrive minst 5 tegn/i)).toBeInTheDocument();
    });

    await step('Mangler begrunnelse', async () => {
      await user.clear(begrunnelseField);
      const submitButton = canvas.getByRole('button', { name: /Bekreft og fortsett/i });
      await user.click(submitButton);
      await waitFor(async function sjekkFeilmelding() {
        await expect(canvas.getAllByText(/Feltet må fylles ut/i).length).toBeGreaterThan(0);
      });
    });

  },
};

const submitSpy = fn();

export const LøsAksjonspunkt: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/behandling/arbeidsgiver', () => {
          return HttpResponse.json({ arbeidsgivere: defaultArbeidsgivere });
        }),
        http.get('*/api/behandling/pleiepenger/inntektsgradering', () => {
          return HttpResponse.json({ perioder: [] });
        }),
        http.get('*/api/behandling/pleiepenger/uttak/overstyrt', () => {
          return HttpResponse.json({
            arbeidsgiverOversikt: { arbeidsgivere: defaultArbeidsgivere },
            overstyringer: [],
          });
        }),
        http.post('*/api/behandling/aksjonspunkt', async ({ request }) => {
          const payload = await request.json().catch(() => undefined);
          submitSpy(payload);
          action('aksjonspunkt:submit')(payload);
          return HttpResponse.json({ status: 'OK', mottatt: payload });
        }),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak(
      [lagOppfyltPeriode('2024-01-01/2024-01-15'), lagOppfyltPeriode('2024-01-16/2024-01-31')],
    ),
    erOverstyrer: false,
    aksjonspunkter: [lagVurderDatoNyRegelAksjonspunkt()],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Velg dato', async () => {
      const dateInput = canvas.getByLabelText('Endringsdato');
      await user.clear(dateInput);
      await user.type(dateInput, '20.01.2024');
      expect(dateInput).toHaveValue('20.01.2024');
    });

    await step('Fyll inn begrunnelse', async () => {
      const begrunnelseField = canvas.getByLabelText('Begrunnelse') as HTMLTextAreaElement;
      await user.clear(begrunnelseField);
      await user.type(
        begrunnelseField,
        'Endringene i uttaksreglene skal gjelde fra 20. januar 2024 da dette er datoen for når de nye reglene trådte i kraft.',
      );
    });

    await step('Bekreft og fortsett', async () => {
      await user.click(canvas.getByRole('button', { name: /Bekreft og fortsett/i }));
      await waitFor(async function sjekkOverstyring() {
        await expect(submitSpy).toHaveBeenCalledWith(
          {
            "behandlingId": "1",
            "behandlingVersjon": 1,
            "bekreftedeAksjonspunktDtoer": [
              {
                "@type": "9291",
                "begrunnelse": "Endringene i uttaksreglene skal gjelde fra 20. januar 2024 da dette er datoen for når de nye reglene trådte i kraft.",
                "kode": "9291",
                "virkningsdato": "2024-01-20",
              },
            ],
          },
        );
      })
    });
  },
};

export const RedigerVurdering: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/behandling/arbeidsgiver', () => {
          return HttpResponse.json({ arbeidsgivere: defaultArbeidsgivere });
        }),
        http.get('*/api/behandling/pleiepenger/inntektsgradering', () => {
          return HttpResponse.json({ perioder: [] });
        }),
        http.get('*/api/behandling/pleiepenger/uttak/overstyrt', () => {
          return HttpResponse.json({
            arbeidsgiverOversikt: { arbeidsgivere: defaultArbeidsgivere },
            overstyringer: [],
          });
        }),
        http.post('*/api/behandling/aksjonspunkt', async ({ request }) => {
          const payload = await request.json().catch(() => undefined);
          submitSpy(payload);
          action('aksjonspunkt:submit')(payload);
          return HttpResponse.json({ status: 'OK', mottatt: payload });
        }),
      ],
    },
  },
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak(
      [lagOppfyltPeriode('2024-01-01/2024-01-15'), lagOppfyltPeriode('2024-01-16/2024-01-31')],
      { virkningsdatoUttakNyeRegler: '2024-01-15' },
    ),
    erOverstyrer: false,
    aksjonspunkter: [
      lagVurderDatoNyRegelAksjonspunkt(AksjonspunktStatus.UTFØRT, {
        begrunnelse:
          'Endringene i uttaksreglene skal gjelde fra 15. januar 2024 da dette er datoen for når de nye reglene trådte i kraft.',
      }),
    ],
    hentBehandling: fn(),
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Viser advarsel for endringsdato', async () => {
      expect(canvas.getByRole('row', { name: 'Informasjon Endringsdato: 15.01.2024 Rediger Etter denne datoen er det endring i hvordan utbetalingsgrad settes for ikke yrkesaktiv, kun ytelse og ny arbeidsaktivitet.' }));
      expect(canvas.getByRole('button', { name: 'Rediger' }))
    })

    await step('Rediger endringsdato', async () => {
      await user.click(canvas.getByRole('button', { name: 'Rediger' }));
      const dateInput = canvas.getByLabelText('Endringsdato');
      await user.clear(dateInput);
      await user.type(dateInput, '20.01.2024');
      const begrunnelseField = canvas.getByLabelText('Begrunnelse') as HTMLTextAreaElement;
      await user.clear(begrunnelseField);
      await user.type(
        begrunnelseField,
        'Endringene i uttaksreglene skal gjelde fra 20. januar 2024 da dette er datoen for når de nye reglene trådte i kraft.',
      );
    });

    await step('Bekreft og fortsett', async () => {
      await user.click(canvas.getByRole('button', { name: /Bekreft og fortsett/i }));
      await waitFor(async function sjekkOverstyring() {
        await expect(submitSpy).toHaveBeenCalledWith(
          {
            "behandlingId": "1",
            "behandlingVersjon": 1,
            "bekreftedeAksjonspunktDtoer": [
              {
                "@type": "9291",
                "begrunnelse": "Endringene i uttaksreglene skal gjelde fra 20. januar 2024 da dette er datoen for når de nye reglene trådte i kraft.",
                "kode": "9291",
                "virkningsdato": "2024-01-20",
              },
            ],
          },
        );
      })
    });

    // Avbryter etter innsendt endring for å tilbakestille visningen i Storybook
    user.click(canvas.getByRole('button', { name: 'Avbryt' }))
  },
};
