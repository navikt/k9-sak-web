import { BehandlingProvider } from '@k9-sak-web/gui/context/BehandlingContext.js';
import { withFakeUttakBackend } from '@k9-sak-web/gui/storybook/decorators/withFakeUttakBackend.js';
import {
  lagOppfyltPeriode,
  lagUtredBehandling,
  lagUttak,
  relevanteAksjonspunkterAlle,
} from '@k9-sak-web/gui/storybook/mocks/uttak/uttakStoryMocks.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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
      await expect(canvas.getByRole('button', { name: 'Rediger dato' })).toBeInTheDocument();
    });

    await step('Viser banner for låst normalarbeidstid', async () => {
      await expect(canvas.getByText(/Endringer fra 01\.01\.2027:/)).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Les mer om endring' })).toBeInTheDocument();
    });

    await step('Åpner dialog fra "Endringer i uttak"-knappen i toppmenyen', async () => {
      await user.click(canvas.getByRole('button', { name: 'Endringer i uttak' }));
      await expect(canvas.getByRole('heading', { name: 'Endringer i uttak' })).toBeInTheDocument();
      await user.click(canvas.getByRole('button', { name: 'Lukk' }));
      await expect(canvas.queryByRole('heading', { name: 'Endringer i uttak' })).not.toBeInTheDocument();
    });

    await step('Åpner dialog fra "Les mer om endring"-knappen i banneret', async () => {
      await user.click(canvas.getByRole('button', { name: 'Les mer om endring' }));
      await expect(canvas.getByRole('heading', { name: 'Endringer i uttak' })).toBeInTheDocument();
      await expect(canvas.getByText('Normalarbeidstid låses på skjæringstidspunktet')).toBeInTheDocument();
    });
  },
};
