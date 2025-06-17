import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import IngenBehandlingValgtPanel from './IngenBehandlingValgtPanel.js';

const meta = {
  title: 'gui/app/feilmeldinger',
  component: IngenBehandlingValgtPanel,
} satisfies Meta<typeof IngenBehandlingValgtPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const IngenBehandlingTilgjengelig: Story = {
  args: {
    numBehandlinger: 0,
  },
  play: async ({ canvas, step }) => {
    await step('skal rendre korrekt melding ved 0 behandlinger', async () => {
      await expect(canvas.getByText('Ingen behandlinger er opprettet')).toBeInTheDocument();
    });
  },
};

export const IngenBehandlingValgt: Story = {
  args: {
    numBehandlinger: 2,
  },
  play: async ({ canvas, step }) => {
    await step('skal rendre korrekt melding ved to behandlinger', async () => {
      await expect(canvas.getByText('Velg behandling')).toBeInTheDocument();
    });
  },
};
