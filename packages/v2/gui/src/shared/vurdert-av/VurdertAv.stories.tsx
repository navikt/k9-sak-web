import { type Meta, type StoryObj } from '@storybook/react';

import { VurdertAv } from './VurdertAv';

const meta = {
  component: VurdertAv,
} satisfies Meta<typeof VurdertAv>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ident: 'navn',
    date: '2023-01-01',
  },
};
