import type { Meta, StoryObj } from '@storybook/react';
import { asyncAction } from '../../../storybook/asyncAction';
import { FakeMarkerBehandlingBackendApi } from '../../../storybook/mocks/FakeMarkerBehandlingBackendApi';
import MarkerBehandlingModal from './components/MarkerBehandlingModal';

const meta = {
  title: 'gui/sak/meny/marker-behandling',
  component: MarkerBehandlingModal,
} satisfies Meta<typeof MarkerBehandlingModal>;

export default meta;

type Story = StoryObj<typeof meta>;

const api = new FakeMarkerBehandlingBackendApi();
export const VisMenyMarkerBehandlingHastekø: Story = {
  args: {
    behandlingUuid: '123',
    brukHastekøMarkering: true,
    lukkModal: asyncAction('lukk modal'),
    api,
  },
};
