import { type Meta, type StoryObj } from '@storybook/react';

import { LabelledContent } from './LabelledContent';

const meta = {
  title: 'gui/shared/labelled-content/LabelledContent',
  component: LabelledContent,
} satisfies Meta<typeof LabelledContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
    content: 'Content',
  },
};
