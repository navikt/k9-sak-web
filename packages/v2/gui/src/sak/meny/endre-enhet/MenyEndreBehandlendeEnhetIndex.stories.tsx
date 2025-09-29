import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { expect } from 'storybook/test';
import MenyEndreBehandlendeEnhetIndexV2 from './MenyEndreBehandlendeEnhetIndex';

const meta = {
  title: 'gui/sak/meny/endre-enhet',
  component: MenyEndreBehandlendeEnhetIndexV2,
} satisfies Meta<typeof MenyEndreBehandlendeEnhetIndexV2>;

export default meta;

export const VisMenyForÅEndreBehandlendeEnhet: StoryObj<typeof MenyEndreBehandlendeEnhetIndexV2> = {
  args: {
    behandlingId: 1,
    behandlingVersjon: 2,
    behandlendeEnhetId: '4292',
    behandlendeEnhetNavn: 'NAV Klageinstans Midt-Norge',
    nyBehandlendeEnhet: action('button-click'),
    behandlendeEnheter: [
      {
        enhetId: '4292',
        enhetNavn: 'NAV Klageinstans Midt-Norge',
      },
      {
        enhetId: '1000',
        enhetNavn: 'NAV Viken',
      },
    ],
    lukkModal: action('button-click'),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('dialog', { name: 'Endre behandlende enhet' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    await expect(canvas.getByRole('textbox', { name: 'Begrunnelse' })).toBeInTheDocument();
    await expect(canvas.getByRole('combobox', { name: 'Ny enhet' })).toBeInTheDocument();
    await expect(canvas.getByRole('option', { name: '1000 NAV Viken' })).toBeInTheDocument();
  },
};
