import type { StoryFn } from '@storybook/react';

import { Period } from '@fpsak-frontend/utils';
import FaktaInstitusjonIndex from './FaktaInstitusjonIndex';
import type { InstitusjonVurderingDtoMedPerioder } from './types/institusjonVurderingDtoMedPerioder';
import type { InstitusjonPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';
import { InstitusjonVurderingDtoResultat } from '@navikt/k9-sak-typescript-client';

export default {
  title: 'gui/fakta/institusjon',
  component: FaktaInstitusjonIndex,
};

const mockPerioder: InstitusjonPeriodeDto[] = [
  {
    periode: {
      fom: '2023-01-01',
      tom: '2023-03-31',
    },
    institusjon: 'Oslo Universitetssykehus',
    journalpostId: { journalpostId: '123456789' },
  },
];

const mockVurderinger: InstitusjonVurderingDtoMedPerioder[] = [
  {
    journalpostId: { journalpostId: '123456789' },
    perioder: [new Period('2023-01-01', '2023-03-31')],
    resultat: InstitusjonVurderingDtoResultat.GODKJENT_MANUELT,
    begrunnelse: 'Pasienten har behov for kontinuerlig oppfølging',
    institusjon: 'Oslo Universitetssykehus',
    vurdertAv: 'Saksbehandler',
    vurdertTidspunkt: '2023-03-31T12:00:00.000Z',
  },
];

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

export const FormWithExistingVurdering = Template.bind({});
FormWithExistingVurdering.args = {
  perioder: [mockPerioder[0] as InstitusjonPeriodeDto],
  vurderinger: [
    {
      ...(mockVurderinger[0] as InstitusjonVurderingDtoMedPerioder),
      resultat: InstitusjonVurderingDtoResultat.GODKJENT_MANUELT,
      begrunnelse: mockVurderinger[0]?.begrunnelse ?? 'Begrunnelse ikke tilgjengelig',
      journalpostId: mockVurderinger[0]?.journalpostId ?? { journalpostId: '123456789' },
    },
  ],
  readOnly: false,
  løsAksjonspunkt: payload => {
    console.log('Løs aksjonspunkt:', payload);
  },
};

export const FormWithNotApprovedVurdering = Template.bind({});
FormWithNotApprovedVurdering.args = {
  perioder: [mockPerioder[0] as InstitusjonPeriodeDto],
  vurderinger: [
    {
      ...(mockVurderinger[0] as InstitusjonVurderingDtoMedPerioder),
      resultat: InstitusjonVurderingDtoResultat.IKKE_GODKJENT_MANUELT,
      begrunnelse: 'Institusjonen er ikke godkjent for denne type opplæring',
      journalpostId: mockVurderinger[0]?.journalpostId ?? { journalpostId: '123456789' },
    },
  ],
  readOnly: false,
  løsAksjonspunkt: payload => {
    console.log('Løs aksjonspunkt:', payload);
  },
};
