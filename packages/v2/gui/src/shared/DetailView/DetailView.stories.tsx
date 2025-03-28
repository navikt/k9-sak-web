import { type Meta, type StoryObj } from '@storybook/react';

import { DetailViewV2 } from './DetailView';

const meta = {
  component: DetailViewV2,
} satisfies Meta<typeof DetailViewV2>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Tittel',
    children: <p>Detaljer</p>,
  },
};
