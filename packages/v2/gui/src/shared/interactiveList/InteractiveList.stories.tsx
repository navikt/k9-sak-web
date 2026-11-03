import type { Meta, StoryObj } from '@storybook/react-vite';

import { InteractiveList } from './InteractiveList.js';

const meta = {
  component: InteractiveList,
} satisfies Meta<typeof InteractiveList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    elements: [
      { content: 'Saken', onClick: () => null, active: false },
      { content: 'Medlemskap', onClick: () => null, active: false },
      { content: 'Opptjening', onClick: () => null, active: true },
      { content: 'Arbeid og inntekt', onClick: () => null, active: false },
    ],
  },
};
