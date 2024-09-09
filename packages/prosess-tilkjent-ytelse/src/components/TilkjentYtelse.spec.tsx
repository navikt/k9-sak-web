import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { BeregningsresultatPeriodeAndel } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
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
                  arbeidsgiverPersonIdent: '',
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
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
      />,
    );

    expect(screen.getByText('Forrige periode')).toBeInTheDocument();
    expect(screen.getByText('Neste periode')).toBeInTheDocument();
  });
});
