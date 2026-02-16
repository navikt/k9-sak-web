import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { LoadingPanel } from './LoadingPanel.jsx';

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
