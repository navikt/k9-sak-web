import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { BehandlingStatus } from '@k9-sak-web/backend/k9sak/kodeverk/BehandlingStatus.js';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import AldersVilkarProsessIndex from './AldersVilkarProsessIndex';

const meta = {
  title: 'gui/prosess/vilkar-alder/AldersVilkarProsessIndex.tsx',
  component: AldersVilkarProsessIndex,
} satisfies Meta<typeof AldersVilkarProsessIndex>;
export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {
  args: {
    behandling: {
      status: BehandlingStatus.OPPRETTET,
    },
    submitCallback: () => action('button-click')('submit'),
    aksjonspunkter: [{ definisjon: aksjonspunktkodeDefinisjonType.ALDERSVILKÅR, status: 'OPPR' }],
    isReadOnly: false,
    angitteBarn: [],
    isAksjonspunktOpen: false,
    vilkar: [
      {
        lovReferanse: '§ 9-5',
        perioder: [{ vilkarStatus: 'IKKE_VURDERT', periode: { fom: '2022-01-01', tom: '2022-12-31' } }],
        vilkarType: vilkarType.ALDERSVILKAR_BARN,
        vurdertAv: 'Ola Nordmann',
      },
    ],
    status: '',
  },
};
