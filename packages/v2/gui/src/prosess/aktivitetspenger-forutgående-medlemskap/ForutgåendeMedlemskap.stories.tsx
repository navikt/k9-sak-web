import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ForutgåendeMedlemskap } from './ForutgåendeMedlemskap';

const meta = {
  title: 'gui/prosess/aktivitetspenger-forutgående-medlemskap/ForutgåendeMedlemskap',
  component: ForutgåendeMedlemskap,
} satisfies Meta<typeof ForutgåendeMedlemskap>;
export default meta;

type Story = StoryObj<typeof meta>;

const submitCallback = fn().mockResolvedValue(undefined);

export const Default: Story = {
  args: {
    submitCallback,
    aksjonspunkt: { definisjon: 'AVKLAR_FORUTGAENDE_MEDLEMSKAP' },
  },
};

export const GodkjennMedlemskap: Story = {
  args: {
    submitCallback,
    aksjonspunkt: { definisjon: 'AVKLAR_FORUTGAENDE_MEDLEMSKAP' },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Velger Ja og sender inn', async () => {
      const user = userEvent.setup();
      await user.click(await canvas.findByRole('radio', { name: 'Ja' }));
      await user.click(await canvas.findByRole('button', { name: 'Bekreft og fortsett' }));
      await expect(submitCallback).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ erGodkjent: true })]),
        expect.anything(),
      );
    });
  },
};

export const AvslagMedlemskap: Story = {
  args: {
    submitCallback,
    aksjonspunkt: { definisjon: 'AVKLAR_FORUTGAENDE_MEDLEMSKAP' },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Velger Nei og sender inn', async () => {
      const user = userEvent.setup();
      await user.click(await canvas.findByRole('radio', { name: 'Nei' }));
      await user.click(await canvas.findByRole('button', { name: 'Bekreft og fortsett' }));
      await expect(submitCallback).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ erGodkjent: false })]),
        expect.anything(),
      );
    });
  },
};
