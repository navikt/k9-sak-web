import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';
import { HttpResponse, http } from 'msw';
import React from 'react';
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
import MainComponent, { MainComponentProps } from '../ui/MainComponent';

const meta: Meta<typeof MainComponent> = {
  args: { data: { ...inntektsmeldingPropsMock, onFinished: action('clicked') } },
  title: 'Inntektsmelding',
  component: MainComponent,
};

export default meta;

const Template = (args: MainComponentProps) => <MainComponent {...args} />;
type Story = StoryObj<typeof MainComponent>;

export const IkkePaakrevd: Story = Template.bind({});
export const Mangler9069: Story = Template.bind({});
export const Mangler9071: Story = Template.bind({});
export const ManglerFlere9071: Story = Template.bind({});
export const IkkePaakrevdOgMangler9071: Story = Template.bind({});
export const FerdigVisning9069: Story = Template.bind({});
export const FerdigVisning9071: Story = Template.bind({});
export const AlleInntektsmeldingerMottatt: Story = Template.bind({});

IkkePaakrevd.args = {
  data: { ...inntektsmeldingPropsMock, onFinished: action('button-click') },
};

IkkePaakrevd.parameters = {
  msw: {
    handlers: [http.get('/tilstand', () => HttpResponse.json(ikkePaakrevd))],
  },
};

Mangler9069.parameters = {
  msw: {
    handlers: [http.get('/tilstand', () => HttpResponse.json(manglerInntektsmelding))],
  },
};
Mangler9071.args = {
  data: { ...aksjonspunkt9071Props, onFinished: action('button-click') },
};

Mangler9071.parameters = {
  msw: {
    handlers: [http.get('/tilstand', () => HttpResponse.json(manglerInntektsmelding))],
  },
};

ManglerFlere9071.args = {
  data: { ...aksjonspunkt9071Props, onFinished: action('button-click') },
};
ManglerFlere9071.parameters = {
  msw: {
    handlers: [http.get('/tilstand', () => HttpResponse.json(manglerFlereInntektsmeldinger))],
  },
};
IkkePaakrevdOgMangler9071.parameters = {
  msw: {
    handlers: [http.get('/tilstand', () => HttpResponse.json(ikkePaakrevdOgManglerInntektsmelding))],
  },
};
FerdigVisning9069.parameters = {
  msw: {
    handlers: [http.get('/tilstand', () => HttpResponse.json(ferdigvisning))],
  },
};
FerdigVisning9071.args = {
  data: { ...aksjonspunkt9071FerdigProps, onFinished: action('button-click') },
};
FerdigVisning9071.parameters = {
  msw: {
    handlers: [http.get('/tilstand', () => HttpResponse.json(ferdigvisning))],
  },
};

AlleInntektsmeldingerMottatt.args = {
  data: { ...aksjonspunkt9071Props, onFinished: action('button-click') },
};
AlleInntektsmeldingerMottatt.parameters = {
  msw: {
    handlers: [http.get('/tilstand', () => HttpResponse.json(alleErMottatt))],
  },
};
