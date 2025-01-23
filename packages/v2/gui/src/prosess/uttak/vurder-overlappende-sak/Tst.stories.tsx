import { action } from '@storybook/addon-actions';
import { type SubmitData, Tst } from './Tst.js';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'gui/Tst',
  component: Tst,
} satisfies Meta<typeof Tst>;

type Story = StoryObj<typeof meta>;

export const TstNum: Story = {
  args: {
    initValues: { someNum: 1234 },
    onSubmit: (data: SubmitData) => action('onSubmit')(data),
  },
};

export const TstNull: Story = {
  args: {
    ...TstNum.args,
    initValues: { someNum: undefined },
  },
};

export default meta;
