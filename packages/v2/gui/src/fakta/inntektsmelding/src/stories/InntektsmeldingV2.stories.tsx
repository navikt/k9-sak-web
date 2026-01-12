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
import type { k9_sak_kontrakt_kompletthet_KompletthetsVurderingDto as KompletthetsVurdering } from '@navikt/k9-sak-typescript-client/types';
import InntektsmeldingContainer, { type InntektsmeldingApi } from '../ui/InntektsmeldingContainer';
import type { InntektsmeldingContextType } from '../types/InntektsmeldingContextType';

const fakeApi = (response: KompletthetsVurdering): InntektsmeldingApi => ({
  getKompletthetsoversikt: () => Promise.resolve(response),
});

const createContainerData = (props: Partial<InntektsmeldingContextType>): InntektsmeldingContextType => ({
  readOnly: false,
  arbeidsforhold: {},
  endpoints: { kompletthetBeregning: '' },
  onFinished: action('onFinished'),
  aksjonspunkter: [],
  ...props,
});

const meta: Meta<typeof InntektsmeldingContainer> = {
  args: {
    data: createContainerData(inntektsmeldingPropsMock),
    requestApi: fakeApi(ikkePaakrevd),
  },
  title: 'Fakta/fakta-inntektsmelding',
  component: InntektsmeldingContainer,
};

export default meta;

type Story = StoryObj<typeof InntektsmeldingContainer>;

export const IkkePaakrevd_V2: Story = {
  args: {
    data: createContainerData(inntektsmeldingPropsMock),
    requestApi: fakeApi(ikkePaakrevd),
  },
};

export const Mangler9069: Story = {
  args: {
    data: createContainerData(inntektsmeldingPropsMock),
    requestApi: fakeApi(manglerInntektsmelding),
  },
};

export const Mangler9071: Story = {
  args: {
    data: createContainerData(aksjonspunkt9071Props),
    requestApi: fakeApi(manglerInntektsmelding),
  },
};

export const ManglerFlere9071_V2: Story = {
  args: {
    data: createContainerData(aksjonspunkt9071Props),
    requestApi: fakeApi(manglerFlereInntektsmeldinger),
  },
};

export const IkkePaakrevdOgMangler9071_V2: Story = {
  args: {
    data: createContainerData(inntektsmeldingPropsMock),
    requestApi: fakeApi(ikkePaakrevdOgManglerInntektsmelding),
  },
};

export const FerdigVisning9069_V2: Story = {
  args: {
    data: createContainerData(inntektsmeldingPropsMock),
    requestApi: fakeApi(ferdigvisning),
  },
};

export const FerdigVisning9071_V2: Story = {
  args: {
    data: createContainerData(aksjonspunkt9071FerdigProps),
    requestApi: fakeApi(ferdigvisning),
  },
};

export const AlleInntektsmeldingerMottatt: Story = {
  args: {
    data: createContainerData(aksjonspunkt9071Props),
    requestApi: fakeApi(alleErMottatt),
  },
};
