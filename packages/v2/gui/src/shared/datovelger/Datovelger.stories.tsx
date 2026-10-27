import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { expect, userEvent } from 'storybook/test';
import Datovelger from './Datovelger.js';

const withForm =
  (defaultValues: Record<string, string> = { dato: '' }): Decorator =>
  Story => {
    const methods = useForm({ defaultValues });
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => {})}>
          <Story />
          <button type="submit">Send</button>
        </form>
      </FormProvider>
    );
  };

const meta = {
  title: 'gui/shared/datovelger/Datovelger',
  component: Datovelger,
  args: {
    name: 'dato',
    label: 'Velg dato',
  },
} satisfies Meta<typeof Datovelger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [withForm()],
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Velg dato')).toBeInTheDocument();
  },
};

export const MedValgtDato: Story = {
  decorators: [withForm({ dato: '2024-06-01' })],
  play: async ({ canvas }) => {
    await expect(canvas.getByDisplayValue('01.06.2024')).toBeInTheDocument();
  },
};

export const ValideringsfeelVedSendSkjema: Story = {
  decorators: [withForm()],
  args: {
    validate: [(v: string) => (!v ? 'Dato er påkrevd' : null)],
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    await expect(await canvas.findByText('Dato er påkrevd')).toBeInTheDocument();
  },
};

export const ReadOnly: Story = {
  decorators: [withForm()],
  args: { readOnly: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Velg dato')).toBeDisabled();
  },
};
