import type { Meta, StoryObj } from '@storybook/react-vite';
import withK9Kodeverkoppslag from '../../../storybook/decorators/withK9Kodeverkoppslag.js';
import { mockArbeidsgiverOpplysninger } from '../../../storybook/mocks/FakeTilkjentYtelseBackendApi.js';
import type { PeriodeMedId } from './TilkjentYtelse.js';
import TilkjentYtelseTimeLineData from './TilkjentYtelseTimelineData.js';

const baseAndel = {
  aktivitetStatus: 'AT' as const,
  inntektskategori: 'ARBEIDSTAKER' as const,
  aktørId: undefined,
  arbeidsforholdId: undefined,
  arbeidsforholdType: '-',
  arbeidsgiverNavn: 'EQUINOR ASA AVD STATOIL SOKKELVIRKSOMHET',
  arbeidsgiverOrgnr: '910909088',
  eksternArbeidsforholdId: undefined,
  refusjon: 0,
  sisteUtbetalingsdato: undefined,
  stillingsprosent: 100,
  uttak: [],
};

const periodeUten847a: PeriodeMedId = {
  id: 1,
  fom: '2024-01-01',
  tom: '2024-01-31',
  dagsats: 800,
  andeler: [{ ...baseAndel, tilSoker: 800, utbetalingsgrad: 100 }],
  totalUtbetalingsgradFraUttak: 1.0,
  totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt: 1.0,
};

const periodeMed847a: PeriodeMedId = {
  id: 2,
  fom: '2024-02-01',
  tom: '2024-02-29',
  dagsats: 520,
  andeler: [{ ...baseAndel, tilSoker: 520, utbetalingsgrad: 65 }],
  totalUtbetalingsgradFraUttak: 0.65,
  totalUtbetalingsgradEtterReduksjonVedTilkommetInntekt: 0.65,
  reduksjonsfaktorInaktivTypeA: 0.65,
};

const meta = {
  title: 'gui/prosess/tilkjent-ytelse/TilkjentYtelseTimelineData',
  component: TilkjentYtelseTimeLineData,
  args: {
    selectedItemStartDate: '2024-01-01',
    selectedItemEndDate: '2024-01-31',
    callbackForward: () => {},
    callbackBackward: () => {},
    arbeidsgiverOpplysningerPerId: mockArbeidsgiverOpplysninger,
  },
  decorators: [withK9Kodeverkoppslag()],
} satisfies Meta<typeof TilkjentYtelseTimeLineData>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UtenParagraf847a: Story = {
  args: {
    selectedItemData: periodeUten847a,
  },
};

export const MedParagraf847a: Story = {
  args: {
    selectedItemStartDate: '2024-02-01',
    selectedItemEndDate: '2024-02-29',
    selectedItemData: periodeMed847a,
  },
};
