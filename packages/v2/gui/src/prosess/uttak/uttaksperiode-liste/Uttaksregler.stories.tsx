import { BehandlingProvider } from '@k9-sak-web/gui/context/BehandlingContext.js';
import { withFakeUttakBackend } from '@k9-sak-web/gui/storybook/decorators/withFakeUttakBackend.js';
import {
  lagAvsluttetBehandling,
  lagOppfyltPeriode,
  lagUtredBehandling,
  lagUttak,
  relevanteAksjonspunkterAlle,
} from '@k9-sak-web/gui/storybook/mocks/uttak/uttakStoryMocks.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import Uttak from '../Uttak';

/**
 * Viser infobannerne for de to uttaksreglene som gjelder fra en gitt dato:
 * - Endringsdato for nye uttaksregler (virkningsdatoUttakNyeRegler)
 * - Låst normalarbeidstid på skjæringstidspunktet
 */
const meta = {
  title: 'gui/prosess/Uttak/Uttaksregler',
  component: Uttak,
  parameters: {
    docs: {
      description: {
        component: 'Infobannere som varsler om regelendringer i uttak, og dialogen som forklarer endringene.',
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
  tags: ['uttak', 'uttaksregler'],
} satisfies Meta<typeof Uttak>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BeggeReglene: Story = {
  decorators: [withFakeUttakBackend()],
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak(
      [
        lagOppfyltPeriode('2026-10-01/2026-10-15'),
        lagOppfyltPeriode('2026-11-01/2026-11-15'),
        lagOppfyltPeriode('2027-01-01/2027-01-15'),
      ],
      { virkningsdatoUttakNyeRegler: '2026-11-01' },
    ),
    erOverstyrer: false,
    aksjonspunkter: [],
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Viser banner for endringsdato', async () => {
      await expect(canvas.getByText(/Endringer fra 01\.11\.2026:/)).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Rediger' })).toBeInTheDocument();
    });

    await step('Viser banner for låst normalarbeidstid', async () => {
      await expect(canvas.getByText(/Endringer fra 01\.01\.2027:/)).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Les mer om endring' })).toBeInTheDocument();
    });

    await step('Åpner dialog fra "Endringer i uttak"-knappen i toppmenyen', async () => {
      await user.click(canvas.getByRole('button', { name: 'Endringer i uttak' }));
      await expect(screen.getByRole('heading', { name: 'Endringer i uttak' })).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Lukk' }));
      await waitFor(async function sjekkLukketDialog() {
        await expect(screen.queryByRole('heading', { name: 'Endringer i uttak' })).not.toBeInTheDocument();
      });
    });

    await step('Åpner dialog fra "Les mer om endring"-knappen i banneret', async () => {
      await user.click(canvas.getByRole('button', { name: 'Les mer om endring' }));
      await expect(screen.getByRole('heading', { name: 'Endringer i uttak' })).toBeInTheDocument();
      await expect(screen.getByText('Normalarbeidstid låses på skjæringstidspunktet')).toBeInTheDocument();
    });
  },
};

const perioderOverSkjæringsdato = [
  lagOppfyltPeriode('2026-10-01/2026-10-15'),
  lagOppfyltPeriode('2027-01-01/2027-01-15'),
];

export const DialogInnhold: Story = {
  decorators: [withFakeUttakBackend(), withFeatureToggles({ NORMALARBEIDSTID_UTTAK: true })],
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak(perioderOverSkjæringsdato),
    erOverstyrer: false,
    aksjonspunkter: [],
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await user.click(canvas.getByRole('button', { name: 'Les mer om endring' }));
    const dialog = screen.getByRole('dialog');
    const innhold = within(dialog);

    await expect(innhold.getByText('Januar 2027')).toBeInTheDocument();
    await expect(innhold.getByText(/alltid ser hen til arbeidstiden på skjæringstidspunktet/)).toBeInTheDocument();
    await expect(innhold.getByText(/gjennom søknad eller punsj/)).toBeInTheDocument();
    await expect(innhold.getByText(/Alle saker som ikke har fått aksjonspunkt/)).toBeInTheDocument();
    await expect(innhold.getByText('November 2025')).toBeInTheDocument();
    await expect(innhold.getByText('Mars 2025')).toBeInTheDocument();
    await expect(innhold.getByText('Oktober 2024')).toBeInTheDocument();
    await expect(innhold.getByText(/kan få utslag i gradering mot inntektstap/)).toBeInTheDocument();
  },
};

export const AvsluttetFørCutoffViserIkkeNormalarbeidstidInfo: Story = {
  decorators: [withFakeUttakBackend(), withFeatureToggles({ NORMALARBEIDSTID_UTTAK: true })],
  args: {
    behandling: lagAvsluttetBehandling({ avsluttet: '2026-10-11T12:00:00' }),
    uttak: lagUttak(perioderOverSkjæringsdato),
    erOverstyrer: false,
    aksjonspunkter: [],
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(/Endringer fra 01\.01\.2027:/)).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Les mer om endring' })).not.toBeInTheDocument();
  },
};

export const AvsluttetEtterCutoffViserNormalarbeidstidInfo: Story = {
  decorators: [withFakeUttakBackend(), withFeatureToggles({ NORMALARBEIDSTID_UTTAK: true })],
  args: {
    behandling: lagAvsluttetBehandling({ avsluttet: '2026-10-12T00:00:00' }),
    uttak: lagUttak(perioderOverSkjæringsdato),
    erOverstyrer: false,
    aksjonspunkter: [],
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Endringer fra 01\.01\.2027:/)).toBeInTheDocument();
  },
};

export const IngenPerioderEtterSkjæringsdato: Story = {
  decorators: [withFakeUttakBackend(), withFeatureToggles({ NORMALARBEIDSTID_UTTAK: true })],
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak([lagOppfyltPeriode('2026-10-01/2026-10-15')]),
    erOverstyrer: false,
    aksjonspunkter: [],
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(/Endringer fra 01\.01\.2027:/)).not.toBeInTheDocument();
  },
};

export const FeatureToggleAv: Story = {
  decorators: [withFakeUttakBackend(), withFeatureToggles({ NORMALARBEIDSTID_UTTAK: false })],
  args: {
    behandling: lagUtredBehandling(),
    uttak: lagUttak(perioderOverSkjæringsdato),
    erOverstyrer: false,
    aksjonspunkter: [],
    relevanteAksjonspunkter: relevanteAksjonspunkterAlle,
    readOnly: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(/Endringer fra 01\.01\.2027:/)).not.toBeInTheDocument();
  },
};
