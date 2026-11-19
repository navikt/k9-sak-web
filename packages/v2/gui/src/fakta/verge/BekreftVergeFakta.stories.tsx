import type { AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import BekreftVergeFakta, { type BekreftVergeAksjonspunkt } from './BekreftVergeFakta.js';

type Props = ComponentProps<typeof BekreftVergeFakta>;

/**
 * Simulerer skallet: etter vellykket lagring får komponenten ny status og lagret begrunnelse, slik den gjør etter
 * at behandlingen er hentet på nytt.
 */
const MedSimulertLagring = (args: Props) => {
  const [status, setStatus] = useState<AksjonspunktStatus | undefined>(args.aksjonspunktStatus);
  const [lagretBegrunnelse, setLagretBegrunnelse] = useState(args.lagretBegrunnelse);
  const submitCallback = async (aksjonspunkter: [BekreftVergeAksjonspunkt]) => {
    await args.submitCallback(aksjonspunkter);
    setStatus(aksjonspunktStatus.UTFØRT);
    setLagretBegrunnelse(aksjonspunkter[0].begrunnelse);
  };
  return (
    <BekreftVergeFakta
      {...args}
      aksjonspunktStatus={status}
      lagretBegrunnelse={lagretBegrunnelse}
      submitCallback={submitCallback}
    />
  );
};

const meta = {
  title: 'gui/fakta/verge/BekreftVergeFakta',
  component: BekreftVergeFakta,
  args: {
    aksjonspunktStatus: aksjonspunktStatus.OPPRETTET,
    lagretBegrunnelse: undefined,
    readOnly: false,
    submittable: true,
    submitCallback: fn(async () => {}),
  },
} satisfies Meta<typeof BekreftVergeFakta>;

export default meta;

type Story = StoryObj<typeof meta>;

const bekreftKnapp = /Bekreft og fortsett/;

export const ÅpentAksjonspunkt: Story = {
  render: args => <MedSimulertLagring {...args} />,
  play: async ({ canvas, args, step }) => {
    const begrunnelse = () => canvas.getByRole('textbox', { name: 'Begrunnelse' });

    await step('Viser tomt skjema uten Avbryt', async () => {
      await expect(canvas.getByText('Søker er under 18 år.')).toBeInTheDocument();
      await expect(canvas.getByRole('heading', { name: 'Mer om verge for mindreårige' })).toBeInTheDocument();
      await expect(begrunnelse()).toHaveValue('');
      await expect(canvas.queryByRole('button', { name: 'Avbryt' })).not.toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: 'Rediger vurdering' })).not.toBeInTheDocument();
    });

    await step('Krever begrunnelse med innhold og maks 4000 tegn', async () => {
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(canvas.getByText('Feltet må fylles ut')).toBeInTheDocument());
      await userEvent.type(begrunnelse(), '   ');
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(canvas.getByText('Feltet må fylles ut')).toBeInTheDocument());
      await userEvent.clear(begrunnelse());
      await userEvent.click(begrunnelse());
      await userEvent.paste('a'.repeat(4001));
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(canvas.getByText('Du kan skrive maksimalt 4000 tegn')).toBeInTheDocument());
      await expect(args.submitCallback).not.toHaveBeenCalled();
    });

    await step('Sender trimmet begrunnelse én gang mens lagring pågår', async () => {
      const lagring = Promise.withResolvers<void>();
      args.submitCallback.mockImplementationOnce(() => lagring.promise);
      await userEvent.clear(begrunnelse());
      await userEvent.type(begrunnelse(), '  OK  ');
      // Knappen mister tilgjengelig navn mens den laster, så samme element brukes videre.
      const knapp = canvas.getByRole('button', { name: bekreftKnapp });
      await userEvent.click(knapp);
      await waitFor(() => expect(knapp).toBeDisabled());
      await userEvent.click(knapp);
      await expect(args.submitCallback).toHaveBeenCalledTimes(1);
      await expect(args.submitCallback).toHaveBeenLastCalledWith([
        { kode: AksjonspunktDefinisjon.AVKLAR_VERGE, begrunnelse: 'OK' },
      ]);
      lagring.resolve();
    });

    await step('Viser lagret begrunnelse etter lagring', async () => {
      await waitFor(() => expect(canvas.queryByRole('textbox', { name: 'Begrunnelse' })).not.toBeInTheDocument());
      await expect(canvas.getByText('OK')).toBeInTheDocument();
      await expect(canvas.getByText(/Behandlet aksjonspunkt/)).toBeInTheDocument();
      await expect(canvas.queryByRole('button', { name: bekreftKnapp })).not.toBeInTheDocument();
    });

    await step('Avbryt i redigering forkaster endringer uten å sende', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Rediger vurdering' }));
      await expect(begrunnelse()).toHaveValue('OK');
      await userEvent.type(begrunnelse(), ' endret');
      await userEvent.click(canvas.getByRole('button', { name: 'Avbryt' }));
      await expect(canvas.getByText('OK')).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: 'Rediger vurdering' }));
      await expect(begrunnelse()).toHaveValue('OK');
      await expect(args.submitCallback).toHaveBeenCalledTimes(1);
    });
  },
};

export const LagringFeilerOgPrøvesPåNytt: Story = {
  render: args => <MedSimulertLagring {...args} />,
  // Feilen fra submitCallback sendes videre fra skjemaet, slik at skallet kan vise den. Det gir en uhåndtert
  // rejection i nettleseren, som ellers ville stoppet testen. Gjelder bare denne historien.
  parameters: { test: { dangerouslyIgnoreUnhandledErrors: true } },
  play: async ({ canvas, args, step }) => {
    const begrunnelse = () => canvas.getByRole('textbox', { name: 'Begrunnelse' });

    await step('Beholder teksten når lagring feiler', async () => {
      args.submitCallback.mockRejectedValueOnce(new Error('Lagring feilet'));
      await userEvent.type(begrunnelse(), 'Signatur er mottatt.');
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(canvas.getByRole('button', { name: bekreftKnapp })).toBeEnabled());
      await expect(begrunnelse()).toHaveValue('Signatur er mottatt.');
    });

    await step('Sender samme begrunnelse på nytt og viser den etter lagring', async () => {
      await userEvent.click(canvas.getByRole('button', { name: bekreftKnapp }));
      await waitFor(() => expect(args.submitCallback).toHaveBeenCalledTimes(2));
      await expect(args.submitCallback).toHaveBeenNthCalledWith(2, [
        { kode: AksjonspunktDefinisjon.AVKLAR_VERGE, begrunnelse: 'Signatur er mottatt.' },
      ]);
      await waitFor(() => expect(canvas.getByText('Signatur er mottatt.')).toBeInTheDocument());
      await expect(canvas.queryByRole('textbox', { name: 'Begrunnelse' })).not.toBeInTheDocument();
    });
  },
};

export const ÅpentAksjonspunktMedLagretBegrunnelse: Story = {
  args: { lagretBegrunnelse: 'Verge har signert &amp; sendt inn søknaden.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue(
      'Verge har signert & sendt inn søknaden.',
    );
    await expect(canvas.getByRole('button', { name: bekreftKnapp })).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Avbryt' })).not.toBeInTheDocument();
  },
};

export const ÅpentAksjonspunktLesevisning: Story = {
  args: { readOnly: true, lagretBegrunnelse: 'Tidligere begrunnelse.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Søker er under 18 år.')).toBeInTheDocument();
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Tidligere begrunnelse.')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: bekreftKnapp })).not.toBeInTheDocument();
  },
};

export const ÅpentAksjonspunktKanIkkeLøses: Story = {
  args: { submittable: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Søker er under 18 år.')).toBeInTheDocument();
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: bekreftKnapp })).not.toBeInTheDocument();
  },
};

export const LesevisningForBeslutter: Story = {
  args: { aksjonspunktStatus: aksjonspunktStatus.UTFØRT, readOnly: true, lagretBegrunnelse: 'Signatur er mottatt.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Signatur er mottatt.')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Rediger vurdering' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: bekreftKnapp })).not.toBeInTheDocument();
  },
};

export const AvbruttAksjonspunkt: Story = {
  args: { aksjonspunktStatus: aksjonspunktStatus.AVBRUTT, lagretBegrunnelse: 'Signatur er mottatt.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Signatur er mottatt.')).toBeInTheDocument();
    await expect(canvas.queryByText(/Behandlet aksjonspunkt/)).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Rediger vurdering' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: bekreftKnapp })).not.toBeInTheDocument();
  },
};

export const UkjentStatus: Story = {
  args: { aksjonspunktStatus: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Rediger vurdering' })).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: bekreftKnapp })).not.toBeInTheDocument();
  },
};
