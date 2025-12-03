import { asyncAction } from '@k9-sak-web/gui/storybook/asyncAction.js';
import withFeatureToggles from '@k9-sak-web/gui/storybook/decorators/withFeatureToggles.js';
import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Komponenter from '../types/Komponenter';
import OmsorgsdagerContainer from './OmsorgsdagerContainer';

const meta = {
  title: 'prosess/prosess-omsorgsdager/OmsorgsdagerContainer',
  component: OmsorgsdagerContainer,
  decorators: [withFeatureToggles({ KRONISK_TIDSBEGRENSET: true })],
} satisfies Meta<typeof OmsorgsdagerContainer>;
export default meta;

type Story = StoryObj<typeof meta>;

export const EkstraOmsorgsdagerKroniskSykTidsbegrenset: Story = {
  args: {
    containerData: {
      props: {
        behandlingsID: '1045657',
        aksjonspunktLost: true,
        lesemodus: true,
        soknadsdato: '2025-12-01',
        begrunnelseFraBruker: 'asdf sdf sdf asdf asdf asdf ',
        informasjonTilLesemodus: {
          begrunnelse: 'asdf asdf asdf asdf ',
          vilkarOppfylt: true,
          avslagsårsakKode: '',
          fraDato: '2025-08-01',
          tilDato: '2026-12-31',
          erTidsbegrenset: true,
        },
        vedtakFattetVilkarOppfylt: false,
        informasjonOmVilkar: {
          begrunnelse: '',
          navnPåAksjonspunkt: 'Utvidet Rett',
          vilkarOppfylt: false,
          vilkar: 'Vilkar ikke funnet.',
          periode: '',
        },
        losAksjonspunkt: asyncAction('Løs aksjonspunkt'),
        formState: { getState: fn(), deleteState: fn(), setState: fn() },
      },
      visKomponent: Komponenter.VILKAR_KRONISK_SYKT_BARN,
    },
  },
};
