import { BeregningsresultatPeriodeAndel } from '@k9-sak-web/types';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { PeriodeMedId, TilkjentYtelse } from './TilkjentYtelse';

describe('<TilkjentYtelse>', () => {
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
                  inntektskategori: {
                    kode: 'ARBEIDSTAKER',
                    kodeverk: 'INNTEKTSKATEGORI',
                  },
                  aktørId: '',
                  arbeidsforholdType: {
                    kode: '',
                    kodeverk: '',
                  },
                  stillingsprosent: 100,
                  arbeidsgiver: '973861778',
                  arbeidsgiverOrgnr: '',
                  aktivitetStatus: {
                    kode: '',
                    kodeverk: '',
                  },
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
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
      />,
      { messages },
    );

    expect(screen.getByText('Forrige periode')).toBeInTheDocument();
    expect(screen.getByText('Neste periode')).toBeInTheDocument();
  });
});
