import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeaderPanel } from './HeaderPanel';

const meta = {
  title: 'gui/sak/dekoratør',
  component: HeaderPanel,
} satisfies Meta<typeof HeaderPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisDekorator: Story = {
  args: {
    navAnsattName: 'Espen Utvikler',
    getPathToLos: () => '',
    getPathToK9Punsj: () => '',
    ainntektPath: 'test',
    aaregPath: 'tast',
    ytelse: 'Pleiepenger og omsorgspenger',
    headerTitleHref: '/k9/web',
  },
};
