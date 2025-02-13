import type { Meta, StoryObj } from '@storybook/react';
import { asyncAction } from '../../../storybook/asyncAction';
import MenyMarkerBehandlingV2 from './MenyMarkerBehandling';

const meta = {
  title: 'gui/sak/meny/marker-behandling',
  component: MenyMarkerBehandlingV2,
} satisfies Meta<typeof MenyMarkerBehandlingV2>;

export default meta;

export const VisMenyMarkerBehandlingHastekø: StoryObj<typeof MenyMarkerBehandlingV2> = {
  args: {
    behandlingUuid: '123',
    markerBehandling: asyncAction('marker behandling'),
    brukHastekøMarkering: true,
    lukkModal: asyncAction('lukk modal'),
    merknaderFraLos: {},
  },
};

export const VisMenyMarkerBehandlingVanskeligKø: StoryObj<typeof MenyMarkerBehandlingV2> = {
  args: {
    behandlingUuid: '123',
    markerBehandling: asyncAction('marker behandling'),
    brukVanskeligKøMarkering: true,
    lukkModal: asyncAction('lukk modal'),
    merknaderFraLos: {},
  },
};
