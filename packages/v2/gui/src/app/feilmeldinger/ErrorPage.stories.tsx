import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import ErrorPage from './ErrorPage.js';

const meta = {
  title: 'gui/app/feilmeldinger',
  component: ErrorPage,
} satisfies Meta<typeof ErrorPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GenerellFeilmelding: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading')).toHaveTextContent(
      'Det har oppstått en teknisk feil i denne behandlingen.',
    );
    await expect(canvas.getByText('Meld fra i porten hvis problemet vedvarer.', { exact: false })).toBeInTheDocument();
  },
};
