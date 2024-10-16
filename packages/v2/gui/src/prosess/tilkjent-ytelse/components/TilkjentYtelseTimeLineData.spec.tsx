import { aktivitetStatusType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/AktivitetStatus.js';
import { inntektskategorier } from '@k9-sak-web/backend/k9sak/kodeverk/Inntektskategori.js';
import { render, screen } from '@testing-library/react';
import { createArbeidsgiverVisningsnavnForAndel } from './TilkjentYteleseUtils';
import type { PeriodeMedId } from './TilkjentYtelse';
import TilkjentYtelseTimeLineData from './TilkjentYtelseTimelineData';

const selectedItemDataFL: PeriodeMedId = {
  andeler: [
    {
      aktivitetStatus: aktivitetStatusType.FL, // AKTIIVITET_STATUS
      arbeidsgiverOrgnr: '',
      eksternArbeidsforholdId: '',
      refusjon: 768,
      inntektskategori: inntektskategorier.FRILANSER,
      tilSoker: 0,
      utbetalingsgrad: 100,
    },
  ],
  dagsats: 768,
  fom: '2020-04-20',
  tom: '2020-04-24',
  id: 0,
};

const selectedItemStartDate = '2020-04-24';
const selectedItemEndDate = '2020-04-24';

const callbackForward = vi.fn();
const callbackBackward = vi.fn();

const kodeverkNavnFraKode = (kodeverk: string) => {
  if (kodeverk === 'AT') {
    return 'Arbeidstaker';
  }
  if (kodeverk === 'SN') {
    return 'Selvstendig næringsdrivende';
  }
  if (kodeverk === 'FL') {
    return 'Frilans';
  }
  return '';
};

describe('<TilkjentYtelseTimeLineData>', () => {
  it('Skal vise riktig aktivitetsStatus', () => {
    render(
      <TilkjentYtelseTimeLineData
        callbackForward={callbackForward}
        callbackBackward={callbackBackward}
        selectedItemData={selectedItemDataFL}
        selectedItemStartDate={selectedItemStartDate}
        selectedItemEndDate={selectedItemEndDate}
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );

    expect(screen.getByText('Aktivitetsstatus:')).toBeInTheDocument();
    const andel = selectedItemDataFL.andeler[0];
    expect(andel).toBeDefined();
    if (andel) {
      expect(createArbeidsgiverVisningsnavnForAndel(andel, kodeverkNavnFraKode, {})).toBe('Frilans');
    }
  });
});
