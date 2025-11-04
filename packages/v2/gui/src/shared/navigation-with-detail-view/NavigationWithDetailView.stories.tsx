import { type Meta, type StoryObj } from '@storybook/react-vite';

import { DetailView } from '../detailView/DetailView';
import { NavigationWithDetailView } from './NavigationWithDetailView';

const meta = {
  component: NavigationWithDetailView,
} satisfies Meta<typeof NavigationWithDetailView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    navigationSection: () => <p>Navigasjon</p>,
    detailSection: () => (
      <DetailView title="Tittel">
        <p>Detaljer</p>
      </DetailView>
    ),
  },
};
