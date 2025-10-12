import { RootFallback } from './RootFallback.js';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'gui/app/suspense/RootFallback',
  component: RootFallback,
} satisfies Meta<typeof RootFallback>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
