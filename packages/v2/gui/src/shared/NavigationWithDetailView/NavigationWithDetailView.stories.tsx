import { Meta, StoryObj } from '@storybook/react';

import { DetailViewV2 } from '../DetailView/DetailView';
import { NavigationWithDetailView } from './NavigationWithDetailView';

const meta = {
  component: NavigationWithDetailView,
} satisfies Meta<typeof NavigationWithDetailView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showDetailSection: true,
    navigationSection: () => <p>Navigasjon</p>,
    detailSection: () => (
      <DetailViewV2 title="Tittel">
        <p>Detaljer</p>
      </DetailViewV2>
    ),
  },
};
