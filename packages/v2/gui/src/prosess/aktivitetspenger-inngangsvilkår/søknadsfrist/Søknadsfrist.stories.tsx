import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Søknadsfrist } from './Søknadsfrist';

const meta = {
  title: 'gui/prosess/aktivitetspenger-inngangsvilkår/Søknadsfrist',
  component: Søknadsfrist,
} satisfies Meta<typeof Søknadsfrist>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Oppfylt: Story = {
  args: {
    søknadsfristVilkår: {
      vilkarType: vilkarType.SØKNADSFRIST,
      perioder: [{ periode: { fom: '2024-01-01', tom: '2024-12-31' }, vilkarStatus: Utfall.OPPFYLT }],
    },
  },
};

export const IkkeOppfylt: Story = {
  args: {
    søknadsfristVilkår: {
      vilkarType: vilkarType.SØKNADSFRIST,
      perioder: [{ periode: { fom: '2024-01-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_OPPFYLT }],
    },
  },
};

export const IkkeVurdert: Story = {
  args: {
    søknadsfristVilkår: {
      vilkarType: vilkarType.SØKNADSFRIST,
      perioder: [{ periode: { fom: '2024-01-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT }],
    },
  },
};

export const FlerePerioder: Story = {
  args: {
    søknadsfristVilkår: {
      vilkarType: vilkarType.SØKNADSFRIST,
      perioder: [
        { periode: { fom: '2024-01-01', tom: '2024-06-30' }, vilkarStatus: Utfall.OPPFYLT },
        { periode: { fom: '2024-07-01', tom: '2024-12-31' }, vilkarStatus: Utfall.IKKE_VURDERT },
      ],
    },
  },
};
