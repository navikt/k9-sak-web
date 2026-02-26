import type { Meta, StoryObj } from '@storybook/react-vite';
import { AleneOmOmsorgenProps } from '../../../types/AleneOmOmsorgenProps';
import AleneOmOmsorgen from './AleneOmOmsorgen';

const formState = {
  getState: () => '',
  setState: () => {},
  deleteState: () => {},
};

const defaultProps: AleneOmOmsorgenProps = {
  behandlingsID: '123',
  aksjonspunktLost: false,
  lesemodus: false,
  fraDatoFraVilkar: '2024-01-15',
  vedtakFattetVilkarOppfylt: false,
  erBehandlingstypeRevurdering: false,
  informasjonOmVilkar: {
    begrunnelse: 'Begrunnelse fra saksbehandler',
    navnPåAksjonspunkt: 'Alene om omsorgen',
    vilkarOppfylt: true,
    vilkar: '§ 9-5 vilkar',
  },
  informasjonTilLesemodus: {
    begrunnelse: '',
    avslagsårsakKode: '',
    vilkarOppfylt: true,
    fraDato: '',
    tilDato: '',
  },
  losAksjonspunkt: aksjonspunkt => console.log('Løser aksjonspunkt', aksjonspunkt),
  formState,
};

const meta = {
  title: 'prosess/prosess-omsorgsdager/AleneOmOmsorgen',
  component: AleneOmOmsorgen,
  args: defaultProps,
} satisfies Meta<typeof AleneOmOmsorgen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ÅpentAksjonspunkt: Story = {};

export const ÅpentAksjonspunktMedTidligereLøstVilkår: Story = {
  args: {
    informasjonTilLesemodus: {
      begrunnelse: 'Søker er alene om omsorgen for barnet.',
      avslagsårsakKode: '',
      vilkarOppfylt: true,
      fraDato: '2024-01-01',
      tilDato: '2025-12-31',
    },
  },
};

export const ÅpentAksjonspunktRevurdering: Story = {
  args: {
    erBehandlingstypeRevurdering: true,
    informasjonTilLesemodus: {
      begrunnelse: '',
      avslagsårsakKode: '',
      vilkarOppfylt: true,
      fraDato: '',
      tilDato: '',
    },
  },
};

export const Lesemodus: Story = {
  args: {
    lesemodus: true,
    informasjonTilLesemodus: {
      begrunnelse: 'Søker er dokumentert alene om omsorgen.',
      avslagsårsakKode: '',
      vilkarOppfylt: true,
      fraDato: '2024-01-01',
      tilDato: '2025-12-31',
    },
  },
};

export const LesemodusMedRediger: Story = {
  args: {
    lesemodus: true,
    aksjonspunktLost: true,
    informasjonTilLesemodus: {
      begrunnelse: 'Søker er dokumentert alene om omsorgen.',
      avslagsårsakKode: '',
      vilkarOppfylt: true,
      fraDato: '2024-01-01',
      tilDato: '2025-12-31',
    },
  },
};

export const LesemodusMedAvslagskode: Story = {
  args: {
    lesemodus: true,
    informasjonTilLesemodus: {
      begrunnelse: 'Foreldre bor på samme adresse.',
      avslagsårsakKode: '1078',
      vilkarOppfylt: false,
      fraDato: '',
      tilDato: '',
    },
  },
};

export const Revurdering: Story = {
  args: {
    erBehandlingstypeRevurdering: true,
    lesemodus: true,
    informasjonTilLesemodus: {
      begrunnelse: 'Vilkår fortsatt oppfylt.',
      avslagsårsakKode: '',
      vilkarOppfylt: true,
      fraDato: '2024-01-01',
      tilDato: '2024-12-31',
    },
  },
};

export const VedtakFattetVilkårOppfylt: Story = {
  args: {
    vedtakFattetVilkarOppfylt: true,
    informasjonOmVilkar: {
      begrunnelse: 'Søker er alene om omsorgen.',
      navnPåAksjonspunkt: 'Alene om omsorgen',
      vilkarOppfylt: true,
      vilkar: '§ 9-5 vilkar',
    },
  },
};

export const VedtakFattetVilkårIkkeOppfylt: Story = {
  args: {
    vedtakFattetVilkarOppfylt: true,
    informasjonOmVilkar: {
      begrunnelse: 'Foreldre bor på samme adresse.',
      navnPåAksjonspunkt: 'Alene om omsorgen',
      vilkarOppfylt: false,
      vilkar: '§ 9-5 vilkar',
    },
  },
};
