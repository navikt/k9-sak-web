import type { StoryFn } from '@storybook/react';
import InstitusjonDetails from './InstitusjonDetails';
import { Vurderingsresultat } from '@k9-sak-web/types';
import type { InstitusjonVurderingMedPerioder } from '@k9-sak-web/types';
import { Period } from '@fpsak-frontend/utils';

export default {
  title: 'fakta/institusjon/InstitusjonDetails',
  component: InstitusjonDetails,
};

const Template: StoryFn<typeof InstitusjonDetails> = args => <InstitusjonDetails {...args} />;

const mockVurdering: InstitusjonVurderingMedPerioder = {
  resultat: Vurderingsresultat.GODKJENT,
  perioder: [new Period('2023-01-01', '2023-12-31')],
  begrunnelse: 'Dette er en begrunnelse',
  institusjon: 'Oslo Universitetssykehus',
  journalpostId: { journalpostId: '123456789' },
};

const mockVurderingMåVurderes: InstitusjonVurderingMedPerioder = {
  ...mockVurdering,
  resultat: Vurderingsresultat.MÅ_VURDERES,
};

export const FerdigVisning = Template.bind({});
FerdigVisning.args = {
  vurdering: mockVurdering,
  readOnly: false,
  løsAksjonspunkt: (payload: any) => console.log('løsAksjonspunkt', payload),
};

export const FerdigVisningReadOnly = Template.bind({});
FerdigVisningReadOnly.args = {
  vurdering: mockVurdering,
  readOnly: true,
  løsAksjonspunkt: (payload: any) => console.log('løsAksjonspunkt', payload),
};

export const VisForm = Template.bind({});
VisForm.args = {
  vurdering: mockVurderingMåVurderes,
  readOnly: false,
  løsAksjonspunkt: (payload: any) => console.log('løsAksjonspunkt', payload),
};

export const FormReadOnly = Template.bind({});
FormReadOnly.args = {
  vurdering: mockVurderingMåVurderes,
  readOnly: true,
  løsAksjonspunkt: (payload: any) => console.log('løsAksjonspunkt', payload),
};
