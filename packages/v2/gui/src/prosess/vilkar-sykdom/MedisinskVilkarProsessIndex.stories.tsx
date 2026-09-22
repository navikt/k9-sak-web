import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import MedisinskVilkarProsessIndex from './MedisinskVilkarProsessIndex';

const meta = {
  title: 'gui/prosess/vilkar-sykdom/MedisinskVilkarProsessIndex.tsx',
  component: MedisinskVilkarProsessIndex,
} satisfies Meta<typeof MedisinskVilkarProsessIndex>;
export default meta;

type Story = StoryObj<typeof meta>;

export const FlerePerioderUnder18År: Story = {
  args: {
    panelTittel: 'Sykdom',
    perioder: [
      {
        vilkarStatus: vilkårStatus.OPPFYLT,
        periode: { fom: '2022-01-01', tom: '2022-06-30' },
        pleietrengendeErOver18år: false,
      },
      {
        vilkarStatus: vilkårStatus.IKKE_OPPFYLT,
        periode: { fom: '2022-07-01', tom: '2022-12-31' },
        pleietrengendeErOver18år: false,
      },
    ],
  },
};

export const EnPeriodeIngenSidemeny: Story = {
  args: {
    panelTittel: 'Sykdom',
    perioder: [
      {
        vilkarStatus: vilkårStatus.OPPFYLT,
        periode: { fom: '2022-01-01', tom: '2022-12-31' },
        pleietrengendeErOver18år: false,
      },
    ],
  },
};

export const PleietrengendeOver18År: Story = {
  args: {
    panelTittel: 'Sykdom',
    perioder: [
      {
        vilkarStatus: vilkårStatus.OPPFYLT,
        periode: { fom: '2022-01-01', tom: '2022-12-31' },
        pleietrengendeErOver18år: true,
      },
    ],
  },
};

export const LivetsSluttfase: Story = {
  args: {
    panelTittel: 'Livets sluttfase',
    lovReferanse: '§ 9-13',
    perioder: [
      {
        vilkarStatus: vilkårStatus.OPPFYLT,
        periode: { fom: '2022-01-01', tom: '2022-12-31' },
        pleietrengendeErOver18år: true,
      },
    ],
  },
};

export const IkkeVurdert: Story = {
  args: {
    panelTittel: 'Sykdom',
    perioder: [
      {
        vilkarStatus: vilkårStatus.IKKE_VURDERT,
        periode: { fom: '2022-01-01', tom: '2022-12-31' },
        pleietrengendeErOver18år: false,
      },
    ],
  },
};
