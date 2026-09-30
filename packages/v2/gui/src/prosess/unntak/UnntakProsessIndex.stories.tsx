import { behandlingResultatType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingResultatType.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { UnntakProsessIndex } from './UnntakProsessIndex.js';

const periode = { fom: '2025-01-01', tom: '2025-12-31' };

const meta = {
  title: 'gui/prosess/unntak/UnntakProsessIndex.tsx',
  component: UnntakProsessIndex,
  args: {
    periode,
    isReadOnly: false,
    readOnlySubmitButton: false,
    submitCallback: fn(),
  },
} satisfies Meta<typeof UnntakProsessIndex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InnvilgetVurdering: Story = {
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
    await userEvent.type(canvas.getByRole('textbox', { name: 'Notat' }), 'Vilkåret er oppfylt');
    await userEvent.click(canvas.getByRole('radio', { name: 'Innvilget eller endring' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
    await waitFor(() =>
      expect(args.submitCallback).toHaveBeenCalledWith([
        {
          kode: '6016',
          periode,
          behandlingResultatType: behandlingResultatType.INNVILGET,
          begrunnelse: 'Vilkåret er oppfylt',
        },
      ]),
    );
  },
};

export const AvslåttVurdering: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByRole('textbox', { name: 'Notat' }), 'Vilkåret er ikke oppfylt');
    await userEvent.click(canvas.getByRole('radio', { name: 'Avslå eller ingen endring' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
    await waitFor(() =>
      expect(args.submitCallback).toHaveBeenCalledWith([
        {
          kode: '6016',
          periode,
          behandlingResultatType: behandlingResultatType.AVSLÅTT,
          begrunnelse: 'Vilkåret er ikke oppfylt',
        },
      ]),
    );
  },
};

export const LagretVurdering: Story = {
  args: {
    begrunnelse: 'Lagret begrunnelse',
    behandlingResultatType: behandlingResultatType.AVSLÅTT,
  },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('textbox', { name: 'Notat' })).toHaveValue('Lagret begrunnelse');
    await expect(canvas.getByRole('radio', { name: 'Avslå eller ingen endring' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Innvilget eller endring' })).not.toBeChecked();
    await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
    await waitFor(() =>
      expect(args.submitCallback).toHaveBeenCalledWith([
        {
          kode: '6016',
          periode,
          behandlingResultatType: behandlingResultatType.AVSLÅTT,
          begrunnelse: 'Lagret begrunnelse',
        },
      ]),
    );
  },
};

export const LagretResultatSomIkkeKanVelges: Story = {
  args: {
    begrunnelse: 'Lagret begrunnelse',
    behandlingResultatType: behandlingResultatType.IKKE_FASTSATT,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: 'Innvilget eller endring' })).not.toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Avslå eller ingen endring' })).not.toBeChecked();
    await expect(canvas.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  },
};

export const SkrivebeskyttetVisning: Story = {
  args: {
    isReadOnly: true,
    readOnlySubmitButton: true,
    begrunnelse: 'Lagret begrunnelse',
    behandlingResultatType: behandlingResultatType.INNVILGET,
  },
  play: async ({ canvas, args }) => {
    await expect(canvas.queryByRole('textbox', { name: 'Notat' })).not.toBeInTheDocument();
    await expect(canvas.getByText('Lagret begrunnelse')).toBeInTheDocument();
    await expect(canvas.getByRole('radiogroup')).toHaveAttribute('aria-readonly', 'true');
    await expect(canvas.getByText('Innvilget eller endring')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    await expect(args.submitCallback).not.toHaveBeenCalled();
  },
};

export const DeaktivertInnsending: Story = {
  args: {
    readOnlySubmitButton: true,
    begrunnelse: 'Lagret begrunnelse',
    behandlingResultatType: behandlingResultatType.INNVILGET,
  },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('radio', { name: 'Avslå eller ingen endring' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Bekreft og fortsett' })).toBeEnabled());
    await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
    await waitFor(() =>
      expect(args.submitCallback).toHaveBeenCalledWith([
        {
          kode: '6016',
          periode,
          behandlingResultatType: behandlingResultatType.AVSLÅTT,
          begrunnelse: 'Lagret begrunnelse',
        },
      ]),
    );
  },
};

export const ForLangBegrunnelse: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('textbox', { name: 'Notat' }));
    await userEvent.paste('a'.repeat(4001));
    await userEvent.click(canvas.getByRole('radio', { name: 'Innvilget eller endring' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Bekreft og fortsett' }));
    await expect(await canvas.findByText('Du kan skrive maksimalt 4000 tegn')).toBeInTheDocument();
    await expect(args.submitCallback).not.toHaveBeenCalled();
  },
};

export const ManglerPeriode: Story = {
  args: {
    periode: undefined,
    begrunnelse: 'Lagret begrunnelse',
    behandlingResultatType: behandlingResultatType.INNVILGET,
  },
  play: async ({ canvas, args }) => {
    await expect(
      canvas.getByText('Fant ikke en gyldig periode for vilkåret. Aksjonspunktet kan ikke løses.'),
    ).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Bekreft og fortsett' })).not.toBeInTheDocument();
    await expect(args.submitCallback).not.toHaveBeenCalled();
  },
};
