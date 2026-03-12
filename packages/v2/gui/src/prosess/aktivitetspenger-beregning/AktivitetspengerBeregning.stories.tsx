import type { Meta, StoryObj } from '@storybook/react-vite';
import { FakeAktivitetspengerBeregningBackendApi } from '../../storybook/mocks/FakeAktivitetspengerBeregningBackendApi';
import AktivitetspengerBeregning from './AktivitetspengerBeregning';

const api = new FakeAktivitetspengerBeregningBackendApi();

const meta = {
  title: 'gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregning',
  component: AktivitetspengerBeregning,
} satisfies Meta<typeof AktivitetspengerBeregning>;
export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {
  args: {
    behandling: { uuid: '123' },
    api,
  },
};
