import type { Meta, StoryObj } from '@storybook/react';

import Template from './Template';

const meta: Meta<typeof Template> = {
  component: Template,
};

export default meta;
type Story = StoryObj<typeof Template>;

export const TemplateStory: Story = {
  args: {
    text: 'Dette er en template story for Storybook',
  },
};
