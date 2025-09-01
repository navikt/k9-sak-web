import LoadingPanel from './LoadingPanel.jsx';
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';

const meta = {
  title: 'gui/shared/loading-panel/LoadingPanel',
  component: LoadingPanel,
} satisfies Meta<typeof LoadingPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisPanel: Story = {
  play: async ({ canvas }) => {
    const title = await canvas.findByTitle('venter...');
    await expect(title).toBeInTheDocument();
  },
};
