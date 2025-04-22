import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import OkAvbrytModal from './OkAvbrytModal';

const meta = {
  title: 'gui/shared/OkAvbrytModal',
  component: OkAvbrytModal,
} satisfies Meta<typeof OkAvbrytModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showModal: true,
    submit: action('button-click'),
    cancel: action('button-click'),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('dialog', { name: 'Bekreft eller avbryt' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  },
};
