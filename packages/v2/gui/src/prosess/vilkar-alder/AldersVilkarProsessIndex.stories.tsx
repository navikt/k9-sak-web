import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { BehandlingStatus } from '@k9-sak-web/backend/k9sak/kodeverk/BehandlingStatus.js';
import type { Meta, StoryObj } from '@storybook/react';
import { asyncAction } from '../../storybook/asyncAction';
import AldersVilkarProsessIndex from './AldersVilkarProsessIndex';

const meta = {
  title: 'gui/prosess/vilkar-alder/AldersVilkarProsessIndex.tsx',
  component: AldersVilkarProsessIndex,
} satisfies Meta<typeof AldersVilkarProsessIndex>;
export default meta;

type Story = StoryObj<typeof meta>;

export const MedUløstAksjonspunkt: Story = {
  args: {
    behandling: {
      status: BehandlingStatus.OPPRETTET,
    },
    submitCallback: asyncAction('button-click'),
    aksjonspunkter: [{ definisjon: aksjonspunktkodeDefinisjonType.ALDERSVILKÅR, status: 'OPPR', kanLoses: true }],
    isReadOnly: false,
    angitteBarn: [{ personIdent: '12345678901' }],
    isAksjonspunktOpen: true,
    vilkar: [
      {
        lovReferanse: '§ 9-5',
        perioder: [{ vilkarStatus: 'IKKE_VURDERT', periode: { fom: '2022-01-01', tom: '2022-12-31' } }],
        vilkarType: vilkarType.ALDERSVILKÅR_BARN,
        vurdertAv: 'Ola Nordmann',
      },
    ],
    status: '',
  },
};

export const Lesevisning: Story = {
  args: {
    behandling: {
      status: BehandlingStatus.AVSLUTTET,
    },
    submitCallback: asyncAction('button-click'),
    aksjonspunkter: [
      {
        definisjon: aksjonspunktkodeDefinisjonType.ALDERSVILKÅR,
        status: 'UTFO',
        kanLoses: false,
        begrunnelse: 'Her er begrunnelsen',
      },
    ],
    isReadOnly: true,
    angitteBarn: [{ personIdent: '12345678901' }],
    isAksjonspunktOpen: false,
    vilkar: [
      {
        lovReferanse: '§ 9-5',
        perioder: [{ vilkarStatus: 'OPPFYLT', periode: { fom: '2022-01-01', tom: '2022-12-31' } }],
        vilkarType: vilkarType.ALDERSVILKÅR_BARN,
        vurdertAv: 'Ola Nordmann',
      },
    ],
    status: vilkårStatus.OPPFYLT,
  },
};
