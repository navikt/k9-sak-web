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
import * as inntektsmeldingQueries from '../api/inntektsmeldingQueries';
import InntektsmeldingIndex, { type InntektsmeldingContainerProps } from '../ui/InntektsmeldingIndex';

const createProps = (props: Partial<InntektsmeldingContainerProps>): InntektsmeldingContainerProps => ({
  ...inntektsmeldingPropsMock,
  submitCallback: action('submitCallback'),
  ...props,
});

const meta: Meta<typeof InntektsmeldingIndex> = {
  args: createProps({}),
  title: 'Fakta/fakta-inntektsmelding',
  component: InntektsmeldingIndex,
  beforeEach: () => {
    vi.spyOn(inntektsmeldingQueries, 'useKompletthetsoversikt').mockReturnValue({
      data: ikkePaakrevd,
    } as ReturnType<typeof inntektsmeldingQueries.useKompletthetsoversikt>);
  },
};

export default meta;

type Story = StoryObj<typeof InntektsmeldingIndex>;

export const IkkePaakrevd_V2: Story = {
  args: createProps({}),
  beforeEach: () => {
    vi.spyOn(inntektsmeldingQueries, 'useKompletthetsoversikt').mockReturnValue({
      data: ikkePaakrevd,
    } as ReturnType<typeof inntektsmeldingQueries.useKompletthetsoversikt>);
  },
};

export const Mangler9069: Story = {
  args: createProps({}),
  beforeEach: () => {
    vi.spyOn(inntektsmeldingQueries, 'useKompletthetsoversikt').mockReturnValue({
      data: manglerInntektsmelding,
    } as ReturnType<typeof inntektsmeldingQueries.useKompletthetsoversikt>);
  },
};

export const Mangler9071: Story = {
  args: createProps(aksjonspunkt9071Props),
  beforeEach: () => {
    vi.spyOn(inntektsmeldingQueries, 'useKompletthetsoversikt').mockReturnValue({
      data: manglerInntektsmelding,
    } as ReturnType<typeof inntektsmeldingQueries.useKompletthetsoversikt>);
  },
};

export const ManglerFlere9071_V2: Story = {
  args: createProps(aksjonspunkt9071Props),
  beforeEach: () => {
    vi.spyOn(inntektsmeldingQueries, 'useKompletthetsoversikt').mockReturnValue({
      data: manglerFlereInntektsmeldinger,
    } as ReturnType<typeof inntektsmeldingQueries.useKompletthetsoversikt>);
  },
};

export const IkkePaakrevdOgMangler9071_V2: Story = {
  args: createProps({}),
  beforeEach: () => {
    vi.spyOn(inntektsmeldingQueries, 'useKompletthetsoversikt').mockReturnValue({
      data: ikkePaakrevdOgManglerInntektsmelding,
    } as ReturnType<typeof inntektsmeldingQueries.useKompletthetsoversikt>);
  },
};

export const FerdigVisning9069_V2: Story = {
  args: createProps({}),
  beforeEach: () => {
    vi.spyOn(inntektsmeldingQueries, 'useKompletthetsoversikt').mockReturnValue({
      data: ferdigvisning,
    } as ReturnType<typeof inntektsmeldingQueries.useKompletthetsoversikt>);
  },
};

export const FerdigVisning9071_V2: Story = {
  args: createProps(aksjonspunkt9071FerdigProps),
  beforeEach: () => {
    vi.spyOn(inntektsmeldingQueries, 'useKompletthetsoversikt').mockReturnValue({
      data: ferdigvisning,
    } as ReturnType<typeof inntektsmeldingQueries.useKompletthetsoversikt>);
  },
};

export const AlleInntektsmeldingerMottatt: Story = {
  args: createProps(aksjonspunkt9071Props),
  beforeEach: () => {
    vi.spyOn(inntektsmeldingQueries, 'useKompletthetsoversikt').mockReturnValue({
      data: alleErMottatt,
    } as ReturnType<typeof inntektsmeldingQueries.useKompletthetsoversikt>);
  },
};
