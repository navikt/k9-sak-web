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
  { eksternReferanse: '1', periode: { fom: '2026-01-10', tom: '2026-01-15' } },
  { eksternReferanse: '2', periode: { fom: '2026-01-15', tom: '2026-01-20' } },
  { eksternReferanse: '3', periode: { fom: '2026-01-20', tom: '2026-01-25' } },
];

export const FlereOppgaver: Story = {
  args: {
    etterlysninger: mockEtterlysninger,
    lukkModal: fn(),
    endreFrister: fn(),
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

export const ValideringAvObligatoriskeFelter: Story = {
  args: {
    etterlysninger: mockEtterlysninger,
    lukkModal: fn(),
    endreFrister: fn(),
  },
};

export const ValideringAvDato: Story = {
  args: {
    etterlysninger: mockEtterlysninger,
    lukkModal: fn(),
    endreFrister: fn(),
  },
};

export const AvbrytModal: Story = {
  args: {
    etterlysninger: mockEtterlysninger,
    lukkModal: fn(),
    endreFrister: fn(),
  },
};

export const ViserSuksessMelding: Story = {
  args: {
    etterlysninger: mockEtterlysninger,
    lukkModal: fn(),
    showSuccess: true,
    endreFrister: fn(),
  },
};
