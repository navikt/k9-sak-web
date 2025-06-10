import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import NetworkErrorPage from './NetworkErrorPage.js';

const meta = {
  title: 'gui/app/feilmeldinger',
  component: NetworkErrorPage,
} satisfies Meta<typeof NetworkErrorPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nettverksfeil: Story = {
  args: {
    statusCode: 400,
    navCallId: 'CallId_1231242_444445',
  },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('heading')).toHaveTextContent('Feil ved henting/sending av data');
    await expect(canvas.getByText('Meld fra i porten hvis problemet vedvarer.', { exact: false })).toBeInTheDocument();
    await expect(canvas.getByText(`${args.navCallId}`, { exact: false })).toBeInTheDocument();
    await expect(canvas.getByText(` (${args.statusCode})`, { exact: false })).toBeInTheDocument();
  },
};
