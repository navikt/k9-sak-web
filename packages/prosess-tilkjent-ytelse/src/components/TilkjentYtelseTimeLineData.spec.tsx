import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import createVisningsnavnForAndel from './TilkjentYteleseUtils';
import { PeriodeMedId } from './TilkjentYtelse';
import TilkjentYtelseTimeLineData from './TilkjentYtelseTimelineData';

const selectedItemDataFL = {
  andeler: [
    {
      aktivitetStatus: 'FL', // 'AKTIVITET_STATUS'
      aktørId: null,
      arbeidsforholdId: null,
      arbeidsforholdType: '-', // 'OPPTJENING_AKTIVITET_TYPE',
      arbeidsgiverNavn: null,
      arbeidsgiverOrgnr: '',
      eksternArbeidsforholdId: null,
      refusjon: 768,
      sisteUtbetalingsdato: '2020-04-28',
      stillingsprosent: 0,
      tilSoker: 0,
      utbetalingsgrad: 100,
      uttak: [
        {
          periode: {
            fom: '2020-04-20',
            tom: '2020-04-24',
          },
          utbetalingsgrad: 100,
          utfall: 'INNVILGET',
        },
      ],
    },
  ],
  dagsats: 768,
  fom: '2020-04-20',
  tom: '2020-04-24',
  id: 0,
} as PeriodeMedId;

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
    renderWithIntl(
      <TilkjentYtelseTimeLineData
        callbackForward={callbackForward}
        callbackBackward={callbackBackward}
        selectedItemData={selectedItemDataFL}
        selectedItemStartDate={selectedItemStartDate}
        selectedItemEndDate={selectedItemEndDate}
        arbeidsgiverOpplysningerPerId={{}}
      />,
      { messages },
    );

    expect(screen.getByText('Aktivitetsstatus:')).toBeInTheDocument();
    expect(createVisningsnavnForAndel(selectedItemDataFL.andeler[0], kodeverkNavnFraKode, {})).toBe('Frilans');
  });
});
