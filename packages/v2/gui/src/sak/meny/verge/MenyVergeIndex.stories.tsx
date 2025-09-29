import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect } from 'storybook/test';
import MenyVergeIndexV2 from './MenyVergeIndex';

export default {
  title: 'gui/sak/meny/verge',
  component: MenyVergeIndexV2,
} satisfies Meta<typeof MenyVergeIndexV2>;

export const VisMenyForÅLeggeTilVerge: StoryObj<typeof MenyVergeIndexV2> = {
  args: {
    opprettVerge: action('button-click'),
    lukkModal: action('button-click'),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Opprett verge/fullmektig?')).toBeInTheDocument();
  },
};

export const VisMenyForÅFjerneVerge: StoryObj<typeof MenyVergeIndexV2> = {
  args: {
    fjernVerge: action('button-click'),
    lukkModal: action('button-click'),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Fjern verge/fullmektig?')).toBeInTheDocument();
  },
};
