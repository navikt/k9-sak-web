import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alder } from './Alder';

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/Alder',
  component: Alder,
} satisfies Meta<typeof Alder>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Oppfylt: Story = {
  args: {
    alderVilkår: {
      vilkarType: vilkarType.ALDERSVILKÅR,
      perioder: [{ periode: { fom: '2024-01-01', tom: '2024-12-31' }, vilkarStatus: Utfall.OPPFYLT }],
    },
  },
};

export const IkkeOppfylt: Story = {
  args: {
    alderVilkår: {
      vilkarType: vilkarType.ALDERSVILKÅR,
      perioder: [{ periode: { fom: '2024-01-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_OPPFYLT }],
    },
  },
};

export const IkkeVurdert: Story = {
  args: {
    alderVilkår: {
      vilkarType: vilkarType.ALDERSVILKÅR,
      perioder: [{ periode: { fom: '2024-01-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT }],
    },
  },
};

export const FlerePerioder: Story = {
  args: {
    alderVilkår: {
      vilkarType: vilkarType.ALDERSVILKÅR,
      perioder: [
        { periode: { fom: '2024-01-01', tom: '2024-06-30' }, vilkarStatus: Utfall.OPPFYLT },
        { periode: { fom: '2024-07-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT },
      ],
    },
  },
};
