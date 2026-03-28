import type { Meta, StoryObj } from '@storybook/react-vite';
import { SplittPanel } from './SplittPanel';

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/SplittPanel',
  component: SplittPanel,
} satisfies Meta<typeof SplittPanel>;
export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {};
