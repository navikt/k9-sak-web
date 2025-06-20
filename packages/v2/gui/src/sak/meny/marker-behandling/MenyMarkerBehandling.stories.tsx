import type { Meta, StoryObj } from '@storybook/react';
import { userEvent } from 'storybook/internal/test';
import { expect } from 'storybook/test';
import { asyncAction } from '../../../storybook/asyncAction';
import withFeatureToggles from '../../../storybook/decorators/withFeatureToggles';
import { FakeMarkerBehandlingBackendApi } from '../../../storybook/mocks/FakeMarkerBehandlingBackendApi';
import { delay } from '../../../utils/delay';
import MarkerBehandlingModal from './components/MarkerBehandlingModal';

const meta = {
  title: 'gui/sak/meny/marker-behandling',
  component: MarkerBehandlingModal,
  decorators: [withFeatureToggles({ LOS_MARKER_BEHANDLING_SUBMIT: true })],
} satisfies Meta<typeof MarkerBehandlingModal>;

export default meta;

type Story = StoryObj<typeof meta>;

const api = new FakeMarkerBehandlingBackendApi();
export const VisMenyMarkerBehandlingHastekø: Story = {
  args: {
    behandlingUuid: '123',
    lukkModal: asyncAction('lukk modal'),
    api,
  },
  play: async ({ canvas, step }) => {
    await step('skal vise inputfelt for tekst gitt at checkbox er valgt', async () => {
      await delay(100);
      await expect(canvas.queryByLabelText('Kommentar')).not.toBeInTheDocument();
      await userEvent.selectOptions(canvas.getByRole('combobox'), 'UTENLANDSTILSNITT');
      await expect(canvas.getByLabelText('Kommentar')).toBeInTheDocument();
    });
  },
};
