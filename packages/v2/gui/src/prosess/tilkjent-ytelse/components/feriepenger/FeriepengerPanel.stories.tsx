import type { k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto as FeriepengegrunnlagAndel } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import withK9Kodeverkoppslag from '../../../../storybook/decorators/withK9Kodeverkoppslag.js';
import { mockArbeidsgiverOpplysninger } from '../../../../storybook/mocks/FakeTilkjentYtelseBackendApi.js';
import { FeriepengerPanel, type FeriepengerPrÅr } from './FeriepengerPanel.js';

const mockFeriepengegrunnlag2023: FeriepengegrunnlagAndel[] = [
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
];
const mockFeriepengegrunnlag2024: FeriepengegrunnlagAndel[] = [
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
];

const mockFeriepengegrunnlag: FeriepengerPrÅr = new Map();
mockFeriepengegrunnlag.set(2023, mockFeriepengegrunnlag2023);
mockFeriepengegrunnlag.set(2024, mockFeriepengegrunnlag2024);

const meta = {
  title: 'gui/prosess/tilkjent-ytelse/FeriepengerPanel',
  component: FeriepengerPanel,
  parameters: {
    layout: 'padded',
  },
  args: {
    arbeidsgiverOpplysningerPerId: mockArbeidsgiverOpplysninger,
  },
  decorators: [withK9Kodeverkoppslag()],
} satisfies Meta<typeof FeriepengerPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MedFlereOpptjeningsår: Story = {
  args: {
    feriepengerPrÅr: mockFeriepengegrunnlag,
  },
};

export const MedEttOpptjeningsår: Story = {
  args: {
    feriepengerPrÅr: new Map([[2024, mockFeriepengegrunnlag2024]]),
  },
};

export const IngenAndeler: Story = {
  args: {
    feriepengerPrÅr: new Map(),
  },
};
