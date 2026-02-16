import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import inntektsmeldingPropsMock, {
  aksjonspunkt9071FerdigProps,
  aksjonspunkt9071Props,
} from '../../mock/inntektsmeldingPropsMock';
import ferdigvisning, {
  alleErMottatt,
  ikkePaakrevd,
  ikkePaakrevdOgManglerInntektsmelding,
  manglerFlereInntektsmeldinger,
  manglerInntektsmelding,
} from '../../mock/mockedKompletthetsdata';
import InntektsmeldingContainer, { type InntektsmeldingApi } from '../ui/InntektsmeldingContainer';

const fakeApi = (response: any): InntektsmeldingApi => ({
  getKompletthetsoversikt: () => Promise.resolve(response),
});

const meta: Meta<typeof InntektsmeldingContainer> = {
  args: {
    data: { ...inntektsmeldingPropsMock, onFinished: action('clicked') } as any,
    requestApi: fakeApi(ikkePaakrevd),
  },
  title: 'Fakta/fakta-inntektsmelding',
  component: InntektsmeldingContainer,
};

export default meta;

type Story = StoryObj<typeof InntektsmeldingContainer>;

export const IkkePaakrevd: Story = {
  args: {
    data: { ...inntektsmeldingPropsMock, onFinished: action('button-click') },
    requestApi: fakeApi(ikkePaakrevd),
  },
};

export const Mangler9069: Story = {
  args: {
    requestApi: fakeApi(manglerInntektsmelding),
  },
};

export const Mangler9071: Story = {
  args: {
    data: { ...aksjonspunkt9071Props, onFinished: action('button-click') },
    requestApi: fakeApi(manglerInntektsmelding),
  },
};

export const ManglerFlere9071: Story = {
  args: {
    data: { ...aksjonspunkt9071Props, onFinished: action('button-click') },
    requestApi: fakeApi(manglerFlereInntektsmeldinger),
  },
};

export const IkkePaakrevdOgMangler9071: Story = {
  args: {
    requestApi: fakeApi(ikkePaakrevdOgManglerInntektsmelding),
  },
};

export const FerdigVisning9069: Story = {
  args: {
    requestApi: fakeApi(ferdigvisning),
  },
};

export const FerdigVisning9071: Story = {
  args: {
    data: { ...aksjonspunkt9071FerdigProps, onFinished: action('button-click') },
    requestApi: fakeApi(ferdigvisning),
  },
};

export const AlleInntektsmeldingerMottatt: Story = {
  args: {
    data: { ...aksjonspunkt9071Props, onFinished: action('button-click') },
    requestApi: fakeApi(alleErMottatt),
  },
};
