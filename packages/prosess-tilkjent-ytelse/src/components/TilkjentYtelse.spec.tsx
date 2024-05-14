import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { BeregningsresultatPeriodeAndel } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import { KodeverkType } from '@k9-sak-web/lib/types/index.js';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { PeriodeMedId, TilkjentYtelse } from './TilkjentYtelse';

describe('<TilkjentYtelse>', () => {
  // mock
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const kodeverkNavnFraKode = (kodeverk: string, kodeverkType: KodeverkType) => {
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

  it('skall innehålla korrekt antal felter', () => {
    renderWithIntl(
      <TilkjentYtelse
        items={
          [
            {
              tom: '2018-10-01',
              fom: '2018-02-02',
              dagsats: 10000,
              andeler: [
                {
                  inntektskategori: 'ARBEIDSTAKER', // 'INNTEKTSKATEGORI',
                  aktørId: '',
                  arbeidsforholdType: '',
                  stillingsprosent: 100,
                  arbeidsgiver: '973861778',
                  arbeidsgiverOrgnr: '',
                  aktivitetStatus: '',
                  arbeidsforholdId: '',
                  eksternArbeidsforholdId: '',
                  arbeidsgiverNavn: '',
                  refusjon: 0,
                  sisteUtbetalingsdato: '2018-03-31',
                  tilSoker: 1846,
                  uttak: [
                    {
                      stonadskontoType: '',
                      periodeResultatType: 'INNVILGET',
                      gradering: false,
                    },
                  ],
                  utbetalingsgrad: 100,
                } as BeregningsresultatPeriodeAndel,
              ],
            },
          ] as PeriodeMedId[]
        }
        groups={[]}
        intl={intlMock}
        arbeidsgiverOpplysningerPerId={{}}
        kodeverkNavnFraKode={kodeverkNavnFraKode}
      />,
      { messages },
    );

    expect(screen.getByText('Forrige periode')).toBeInTheDocument();
    expect(screen.getByText('Neste periode')).toBeInTheDocument();
  });
});
