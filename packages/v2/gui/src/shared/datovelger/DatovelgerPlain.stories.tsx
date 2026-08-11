import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import DatovelgerPlain from './DatovelgerPlain.js';

const meta = {
  title: 'gui/shared/datovelger/DatovelgerPlain',
  component: DatovelgerPlain,
  args: {
    label: 'Velg dato',
    onChange: () => {},
    onBlur: () => {},
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
