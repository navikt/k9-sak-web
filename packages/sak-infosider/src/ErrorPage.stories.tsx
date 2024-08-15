import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import ErrorPage from './ErrorPage.js';

const meta = {
  title: 'sak/sak-infosider',
  component: ErrorPage,
} satisfies Meta<typeof ErrorPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GenerellFeilmelding: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading')).toHaveTextContent(
      'Det har oppstått en teknisk feil i denne behandlingen. Meld feilen i Porten. Ta med feilmeldingsteksten.',
    );
  },
};
