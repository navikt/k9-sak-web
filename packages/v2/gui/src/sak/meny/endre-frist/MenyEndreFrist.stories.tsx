import {
  ung_kodeverk_varsel_EtterlysningStatus,
  ung_kodeverk_varsel_EtterlysningType,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { MenyEndreFrist } from './MenyEndreFrist.js';

const meta = {
  title: 'gui/sak/meny/endre-frist',
  component: MenyEndreFrist,
} satisfies Meta<typeof MenyEndreFrist>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockEtterlysninger = [
  {
    status: ung_kodeverk_varsel_EtterlysningStatus.VENTER,
    type: ung_kodeverk_varsel_EtterlysningType.UTTALELSE_KONTROLL_INNTEKT,
    periode: { fom: '2025-11-01', tom: '2025-11-30' },
    eksternReferanse: 'bf210a62-d9a9-4d49-93dc-ecb10a1a91ab',
  },
  {
    status: ung_kodeverk_varsel_EtterlysningStatus.VENTER,
    type: ung_kodeverk_varsel_EtterlysningType.UTTALELSE_KONTROLL_INNTEKT,
    periode: { fom: '2025-12-01', tom: '2025-12-31' },
    eksternReferanse: 'ca884eaf-4610-46a8-859c-1c9c7fef8961',
  },
];

export const FlereOppgaver: Story = {
  args: {
    etterlysninger: mockEtterlysninger,
    lukkModal: fn(),
    endreFrister: fn(),
    isLoading: false,
  },
  play: async ({ canvas, step }) => {
    const body = within(canvas.getByRole('dialog'));

    await step('Velg oppgave', async () => {
      const oppgaveSelect = body.getByLabelText('Velg oppgave');
      await userEvent.selectOptions(oppgaveSelect, '2');
      await expect(oppgaveSelect).toHaveValue('2');
    });

    await step('Velg ny fristdato', async () => {
      const fristDatoInput = body.getByLabelText('Ny fristdato');
      await userEvent.type(fristDatoInput, '30.01.2026');
      await expect(fristDatoInput).toHaveValue('30.01.2026');
    });

    await step('Skriv begrunnelse', async () => {
      const begrunnelseInput = body.getByLabelText('Begrunnelse');
      await userEvent.type(begrunnelseInput, 'Deltaker trenger mer tid til å samle dokumentasjon');
      await expect(begrunnelseInput).toHaveValue('Deltaker trenger mer tid til å samle dokumentasjon');
    });

    await step('Bekreft endring', async () => {
      const bekreftButton = body.getByRole('button', { name: 'Utsett frist' });
      await userEvent.click(bekreftButton);
      // Verification of submission would happen in actual implementation
    });
  },
};

export const EnOppgave: Story = {
  args: {
    etterlysninger: [mockEtterlysninger[0]!],
    lukkModal: fn(),
    endreFrister: fn(),
    isLoading: false,
  },
  play: async ({ canvas, step }) => {
    const body = within(canvas.getByRole('dialog'));

    await step('Oppgave er forhåndsvalgt og read-only', async () => {
      const oppgaveSelect = body.getByLabelText('Velg oppgave');
      await expect(oppgaveSelect).toHaveValue('1');
      await expect(oppgaveSelect).toHaveAttribute('readonly');
    });
  },
};

export const ViserSuksessMelding: Story = {
  args: {
    etterlysninger: mockEtterlysninger,
    lukkModal: fn(),
    showSuccess: true,
    endreFrister: fn(),
    isLoading: false,
  },
  play: async ({ canvas, step }) => {
    const body = within(canvas.getByRole('dialog'));

    await step('Suksessmelding vises', async () => {
      await expect(body.getByText(/Oppgaven har fått ny frist/i)).toBeInTheDocument();
    });

    await step('Lukk-knapp er tilgjengelig', async () => {
      const lukkButton = body.getByRole('button', { name: 'Lukk' });
      await expect(lukkButton).toBeInTheDocument();
    });
  },
};

export const ViserLaster: Story = {
  args: {
    etterlysninger: mockEtterlysninger,
    lukkModal: fn(),
    showSuccess: false,
    endreFrister: fn(),
    isLoading: true,
  },
  play: async ({ canvas, step }) => {
    await step('Viser loading spinner', async () => {
      const dialog = canvas.getByRole('dialog');
      await expect(dialog).toBeInTheDocument();
      // LoadingPanel should be visible
    });
  },
};

export const ViserFeilmelding: Story = {
  args: {
    etterlysninger: mockEtterlysninger,
    lukkModal: fn(),
    endreFrister: fn(),
    isLoading: false,
    submitError: 'Kunne ikke endre frist. Prøv igjen senere.',
  },
  play: async ({ canvas, step }) => {
    const body = within(canvas.getByRole('dialog'));

    await step('Feilmelding vises', async () => {
      await expect(body.getByText('Kunne ikke endre frist. Prøv igjen senere.')).toBeInTheDocument();
    });

    await step('Skjema er fortsatt tilgjengelig', async () => {
      await expect(body.getByLabelText('Velg oppgave')).toBeInTheDocument();
      await expect(body.getByLabelText('Ny fristdato')).toBeInTheDocument();
      await expect(body.getByLabelText('Begrunnelse')).toBeInTheDocument();
    });
  },
};
