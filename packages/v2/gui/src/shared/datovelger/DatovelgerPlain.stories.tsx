import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import DatovelgerPlain from './DatovelgerPlain.js';

const meta = {
  title: 'gui/shared/datovelger/DatovelgerPlain',
  component: DatovelgerPlain,
  args: {
    label: 'Velg dato',
    onChange: fn(),
    onBlur: fn(),
    value: '',
    selectedDay: '',
  },
} satisfies Meta<typeof DatovelgerPlain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Velg dato')).toBeInTheDocument();
  },
};

export const MedFeilmelding: Story = {
  args: { errorMessage: 'Dato er påkrevd' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Dato er påkrevd')).toBeInTheDocument();
  },
};

export const MedValgtDato: Story = {
  args: { value: '2024-06-01', selectedDay: '2024-06-01' },
  play: async ({ canvas }) => {
    await expect(canvas.getByDisplayValue('01.06.2024')).toBeInTheDocument();
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Velg dato')).toBeDisabled();
  },
};

// Tester at ulike datoformater tolkes riktig til ISO-format
const inputFormatPlay =
  (input: string): Story['play'] =>
  async ({ canvas, args }) => {
    const inputEl = canvas.getByLabelText('Velg dato');
    await userEvent.clear(inputEl);
    await userEvent.type(inputEl, input);
    await userEvent.tab();
    await expect(args.onChange).toHaveBeenCalledWith('2026-08-11');
  };

export const FormatDDMMYY: Story = {
  play: inputFormatPlay('110826'),
};

export const FormatDDMMYYYY: Story = {
  play: inputFormatPlay('11.08.2026'),
};

export const FormatDDMMYYYYUtenPunktum: Story = {
  play: inputFormatPlay('11082026'),
};

export const FormatDDSlashMMSlashYYYY: Story = {
  play: inputFormatPlay('11/08/2026'),
};

export const FormatDDDashMMDashYYYY: Story = {
  play: inputFormatPlay('11-08-2026'),
};
