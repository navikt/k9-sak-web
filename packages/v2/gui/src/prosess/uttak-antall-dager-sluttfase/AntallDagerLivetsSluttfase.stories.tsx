import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import type { KvoteInfo } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/KvoteInfo.js';
import { withFakeUttakBackend } from '../../storybook/decorators/withFakeUttakBackend.js';
import { lagUttak } from '../../storybook/mocks/uttak/uttakStoryMocks.js';
import { AntallDagerLivetsSluttfase } from './AntallDagerLivetsSluttfase.js';

const medKvoteInfo = (kvoteInfo: KvoteInfo | undefined) =>
  withFakeUttakBackend({ uttak: lagUttak([], { uttaksplan: { perioder: {}, kvoteInfo } }) });

const meta = {
  title: 'gui/prosess/uttak-antall-dager-sluttfase/AntallDagerLivetsSluttfase',
  component: AntallDagerLivetsSluttfase,
  args: {
    behandlingUuid: '4d8a2c1e-8b1a-4c3b-9f0e-1a2b3c4d5e6f',
    behandlingVersjon: 1,
  },
} satisfies Meta<typeof AntallDagerLivetsSluttfase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ForbrukInnenforKvote: Story = {
  decorators: [medKvoteInfo({ maxDato: '2021-02-20', totaltForbruktKvote: 20 })],
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { name: 'Uttak av pleiepenger' })).toBeInTheDocument();
    await expect(canvas.getByText('Siste pleiedag:')).toBeInTheDocument();
    await expect(canvas.getByText('20.02.2021', { exact: false })).toBeInTheDocument();
    await expect(canvas.getByText('20 av 60 dager')).toBeInTheDocument();
    await expect(canvas.getByText('40 dager')).toBeInTheDocument();
    await expect(canvas.getByTestId('fremdriftslinje-gronn')).toBeInTheDocument();
    await expect(canvas.queryByTestId('fremdriftslinje-gul')).not.toBeInTheDocument();
  },
};

export const KvoteBruktOpp: Story = {
  decorators: [medKvoteInfo({ maxDato: '2021-02-20', totaltForbruktKvote: 60 })],
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('60 av 60 dager')).toBeInTheDocument();
    await expect(canvas.queryByText(/gjenstår etter denne behandlingen/)).not.toBeInTheDocument();
    await expect(canvas.getByTestId('fremdriftslinje-gronn')).toBeInTheDocument();
    await expect(canvas.queryByTestId('fremdriftslinje-gul')).not.toBeInTheDocument();
  },
};

export const Overforbruk: Story = {
  decorators: [medKvoteInfo({ maxDato: '2021-02-20', totaltForbruktKvote: 70 })],
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('70 av 60 dager')).toBeInTheDocument();
    await expect(canvas.queryByText(/gjenstår etter denne behandlingen/)).not.toBeInTheDocument();
    await expect(canvas.queryByTestId('fremdriftslinje-gronn')).not.toBeInTheDocument();
    await expect(canvas.getByTestId('fremdriftslinje-gul')).toBeInTheDocument();
  },
};

export const UtenSistePleiedagOgForbruk: Story = {
  decorators: [medKvoteInfo({ totaltForbruktKvote: 0 })],
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('60 dager')).toBeInTheDocument();
    await expect(canvas.queryByText('Siste pleiedag:')).not.toBeInTheDocument();
    await expect(canvas.queryByText(/forbrukt\./)).not.toBeInTheDocument();
    await expect(canvas.queryByTestId('fremdriftslinje-gronn')).not.toBeInTheDocument();
  },
};

export const UtenKvoteInfo: Story = {
  decorators: [medKvoteInfo(undefined)],
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading', { name: 'Uttak av pleiepenger' })).not.toBeInTheDocument();
  },
};
