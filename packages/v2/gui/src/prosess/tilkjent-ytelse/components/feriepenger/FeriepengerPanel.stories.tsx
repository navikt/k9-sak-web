import type { Meta, StoryObj } from '@storybook/react-vite';
import type { k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagDto as Feriepengegrunnlag } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { FeriepengerPanel } from './FeriepengerPanel.js';
import type { ArbeidsgiverOpplysningerPerId } from '../../types/arbeidsgiverOpplysningerType.js';

const mockArbeidsgiverOpplysninger: ArbeidsgiverOpplysningerPerId = {
  '910909088': {
    identifikator: '910909088',
    navn: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
    erPrivatPerson: false,
  },
  '973861778': {
    identifikator: '973861778',
    navn: 'SOPRA STERIA AS',
    erPrivatPerson: false,
  },
};

const mockFeriepengegrunnlag: Feriepengegrunnlag = {
  andeler: [
    {
      opptjeningsår: 2023,
      aktivitetStatus: 'AT',
      arbeidsgiverId: '910909088',
      arbeidsforholdId: 'abc123',
      erBrukerMottaker: false,
      årsbeløp: 15000,
    },
    {
      opptjeningsår: 2023,
      aktivitetStatus: 'AT',
      arbeidsgiverId: '910909088',
      arbeidsforholdId: 'abc123',
      erBrukerMottaker: true,
      årsbeløp: 5000,
    },
    {
      opptjeningsår: 2023,
      aktivitetStatus: 'AT',
      arbeidsgiverId: '973861778',
      erBrukerMottaker: false,
      årsbeløp: 8000,
    },
    {
      opptjeningsår: 2024,
      aktivitetStatus: 'AT',
      arbeidsgiverId: '910909088',
      arbeidsforholdId: 'abc123',
      erBrukerMottaker: false,
      årsbeløp: 18000,
    },
    {
      opptjeningsår: 2024,
      aktivitetStatus: 'AT',
      arbeidsgiverId: '973861778',
      erBrukerMottaker: true,
      årsbeløp: 6000,
    },
    {
      opptjeningsår: 2024,
      aktivitetStatus: 'FL',
      erBrukerMottaker: true,
      årsbeløp: 3000,
    },
  ],
};

const meta = {
  title: 'gui/prosess/tilkjent-ytelse/FeriepengerPanel',
  component: FeriepengerPanel,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof FeriepengerPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MedFlereOpptjeningsår: Story = {
  args: {
    feriepengegrunnlag: mockFeriepengegrunnlag,
    arbeidsgiverOpplysningerPerId: mockArbeidsgiverOpplysninger,
  },
};

export const MedEttOpptjeningsår: Story = {
  args: {
    feriepengegrunnlag: {
      andeler: mockFeriepengegrunnlag.andeler.filter(andel => andel.opptjeningsår === 2024),
    },
    arbeidsgiverOpplysningerPerId: mockArbeidsgiverOpplysninger,
  },
};

export const IngenAndeler: Story = {
  args: {
    feriepengegrunnlag: {
      andeler: [],
    },
    arbeidsgiverOpplysningerPerId: mockArbeidsgiverOpplysninger,
  },
};
