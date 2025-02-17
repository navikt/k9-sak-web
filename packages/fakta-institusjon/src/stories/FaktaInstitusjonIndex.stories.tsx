import React from 'react';
import { StoryFn } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import FaktaInstitusjonIndex from '../FaktaInstitusjonIndex';
import { InstitusjonPeriode, Vurderingsresultat, InstitusjonVurderingMedPerioder } from '@k9-sak-web/types';
import { Period } from '@fpsak-frontend/utils';

const withIntl = (Story: StoryFn<typeof FaktaInstitusjonIndex>) => {
  const StoryComponent = Story as React.ComponentType;
  return (
    <IntlProvider locale="nb-NO" messages={{}}>
      <StoryComponent />
    </IntlProvider>
  );
};

export default {
  title: 'fakta/fakta-institusjon',
  component: FaktaInstitusjonIndex,
  decorators: [withIntl],
};

const mockPerioder: InstitusjonPeriode[] = [
  {
    periode: {
      fom: '2023-01-01',
      tom: '2023-03-31',
    },
    institusjon: 'Oslo Universitetssykehus',
    journalpostId: { journalpostId: '123456789' },
  },
];

const mockVurderinger: InstitusjonVurderingMedPerioder[] = [
  {
    journalpostId: { journalpostId: '123456789' },
    perioder: [new Period('2023-01-01', '2023-03-31')],
    resultat: Vurderingsresultat.GODKJENT_MANUELT,
    begrunnelse: 'Pasienten har behov for kontinuerlig oppfølging',
    institusjon: 'Oslo Universitetssykehus',
    vurdertAv: 'Saksbehandler',
    vurdertTidspunkt: '2023-03-31T12:00:00.000Z',
  },
];

const mockAksjonspunkt = {
  definisjon: {
    kode: '5085',
    aksjonspunktType: 'MANUELL',
  },
  status: {
    kode: 'OPPR',
  },
  kanLoses: true,
};

const Template: StoryFn<typeof FaktaInstitusjonIndex> = args => <FaktaInstitusjonIndex {...args} />;

export const Default = Template.bind({});
Default.args = {
  perioder: mockPerioder,
  vurderinger: mockVurderinger,
  readOnly: false,
  løsAksjonspunkt: payload => {
    console.log('Løs aksjonspunkt:', payload);
  },
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  ...Default.args,
  readOnly: true,
};

export const IngenPerioder = Template.bind({});
IngenPerioder.args = {
  ...Default.args,
  perioder: [],
  vurderinger: [],
};

// New stories for form states
export const FormEditing = Template.bind({});
FormEditing.args = {
  perioder: mockPerioder,
  vurderinger: [],
  readOnly: false,
  aksjonspunkter: [mockAksjonspunkt],
  løsAksjonspunkt: payload => {
    console.log('Løs aksjonspunkt:', payload);
  },
};

export const FormWithExistingVurdering = Template.bind({});
FormWithExistingVurdering.args = {
  perioder: [mockPerioder[0]],
  vurderinger: [
    {
      ...mockVurderinger[0],
      resultat: Vurderingsresultat.GODKJENT_MANUELT,
    },
  ],
  readOnly: false,
  løsAksjonspunkt: payload => {
    console.log('Løs aksjonspunkt:', payload);
  },
};

export const FormWithNotApprovedVurdering = Template.bind({});
FormWithNotApprovedVurdering.args = {
  perioder: [mockPerioder[0]],
  vurderinger: [
    {
      ...mockVurderinger[0],
      resultat: Vurderingsresultat.IKKE_GODKJENT_MANUELT,
      begrunnelse: 'Institusjonen er ikke godkjent for denne type opplæring',
    },
  ],
  readOnly: false,
  løsAksjonspunkt: payload => {
    console.log('Løs aksjonspunkt:', payload);
  },
};

export const FormReadOnly = Template.bind({});
FormReadOnly.args = {
  perioder: [mockPerioder[0]],
  vurderinger: [mockVurderinger[0]],
  readOnly: true,
  løsAksjonspunkt: payload => {
    console.log('Løs aksjonspunkt:', payload);
  },
};

export const Loading = Template.bind({});
Loading.args = {
  perioder: mockPerioder,
  vurderinger: mockVurderinger,
  readOnly: false,
  isLoading: true,
  løsAksjonspunkt: payload => {
    console.log('Løs aksjonspunkt:', payload);
  },
};

export const WithError = Template.bind({});
WithError.args = {
  perioder: mockPerioder,
  vurderinger: mockVurderinger,
  readOnly: false,
  error: 'Det oppstod en feil ved lasting av data',
  løsAksjonspunkt: payload => {
    console.log('Løs aksjonspunkt:', payload);
  },
};
