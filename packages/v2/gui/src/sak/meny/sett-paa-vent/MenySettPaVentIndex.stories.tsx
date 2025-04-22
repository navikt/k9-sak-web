import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { action } from '@storybook/addon-actions';
import { asyncAction } from '../../../storybook/asyncAction';
import MenySettPaVentIndexV2 from './MenySettPaVentIndex';
import withKodeverkContext from '../../../storybook/decorators/withKodeverkContext.js';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'gui/sak/meny/sett-pa-vent',
  component: MenySettPaVentIndexV2,
  decorators: [
    withKodeverkContext({
      behandlingType: behandlingType.FØRSTEGANGSSØKNAD,
    }),
  ],
} satisfies Meta<typeof MenySettPaVentIndexV2>;

export default meta;

type Story = StoryObj<typeof meta>;

export const visMenyForÅSetteBehandlingPåVent: Story = {
  args: {
    behandlingId: 1,
    behandlingVersjon: 2,
    settBehandlingPaVent: asyncAction('sett behandling på vent'),
    lukkModal: action('lukkModal'),
    erTilbakekreving: false,
  },
};
