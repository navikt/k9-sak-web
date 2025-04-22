import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { asyncAction } from '../../../storybook/asyncAction';
import MenyTaAvVentIndexV2 from './MenyTaAvVentIndex';

const meta = {
  title: 'gui/sak/meny/ta-av-vent',
  component: MenyTaAvVentIndexV2,
} satisfies Meta<typeof MenyTaAvVentIndexV2>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    behandlingId: 1,
    behandlingVersjon: 2,
    taBehandlingAvVent: asyncAction('ta behandling av vent'),
    lukkModal: action('lukk modal'),
  },
};
