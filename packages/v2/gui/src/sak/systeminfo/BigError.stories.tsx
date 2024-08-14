import { BigError } from './BigError.js';
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';

const meta = {
  title: 'gui/sak/systeminfo/BigError',
  component: BigError,
} satisfies Meta<typeof BigError>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EnkelFeilmelding: Story = {
  args: {
    title: 'Overskrift feil',
    children: 'Enkel feilmeldingstekst',
  },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('heading')).toHaveTextContent(args.title || '');
    await expect(typeof args.children).toBe('string');
    if (typeof args.children === 'string') {
      await expect(canvas.getByText(args.children)).toBeInTheDocument();
    }
  },
};

export const FeilmeldingMedUtfyllandeTekst: Story = {
  args: {
    title: 'Overskrift utfyllande feil',
    children: (
      <p>
        Her er meir utfyllande tekst, inkludert <a href="#dummy">link til meir info</a>
      </p>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Her er meir utfyllande tekst,', { exact: false })).toBeInTheDocument();
  },
};

export const FleireAvsnitt: Story = {
  args: {
    title: 'Overskrift',
    children: (
      <>
        <p>Første avsnitt med feilmeldingstekst.</p>
        <p>Andre avsnitt med feilmeldingstekst.</p>
        <p>Tredje avsnitt med feilmeldingstekst.</p>
      </>
    ),
  },
};

export const UtenTittel: Story = {
  args: {
    children: 'Feilmeldingstekst',
  },
};
