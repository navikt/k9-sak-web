import { Meta, StoryObj } from '@storybook/react/*';

import { AssessedBy } from './AssessedBy';

const meta = {
  component: AssessedBy,
} satisfies Meta<typeof AssessedBy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ident: 'navn',
    date: '2023-01-01',
  },
};
