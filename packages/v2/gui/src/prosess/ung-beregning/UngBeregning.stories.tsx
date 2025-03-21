import type { Meta, StoryObj } from '@storybook/react';
import { asyncAction } from '../../storybook/asyncAction';
import { FakeUngBeregningBackendApi } from '../../storybook/mocks/FakeUngBeregningBackendApi';
import UngBeregning from './UngBeregning';

const api = new FakeUngBeregningBackendApi();
const meta = {
  title: 'gui/prosess/ung-beregning/UngBeregning.tsx',
  component: UngBeregning,
} satisfies Meta<typeof UngBeregning>;
export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {
  args: { behandling: { uuid: '123' }, api, barn: [], submitCallback: asyncAction('Løs aksjonspunkt') },
};
