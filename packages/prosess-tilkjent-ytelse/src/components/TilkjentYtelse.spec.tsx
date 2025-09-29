import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { k9_sak_kontrakt_beregningsresultat_BeregningsresultatPeriodeAndelDto as BeregningsresultatPeriodeAndelDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { screen } from '@testing-library/react';
import { PeriodeMedId, TilkjentYtelse } from './TilkjentYtelse';

describe('<TilkjentYtelse>', () => {
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
                  inntektskategori: 'ARBEIDSTAKER', // INNTEKTSKATEGORI
                  aktørId: '',
                  arbeidsforholdType: 'ARBEID',
                  stillingsprosent: 100,
                  arbeidsgiver: '973861778',
                  arbeidsgiverOrgnr: '',
                  arbeidsgiverPersonIdent: '',
                  aktivitetStatus: 'AT',
                  arbeidsforholdId: '',
                  eksternArbeidsforholdId: '',
                  arbeidsgiverNavn: '',
                  refusjon: 0,
                  sisteUtbetalingsdato: '2018-03-31',
                  tilSoker: 1846,
                  uttak: [],
                  utbetalingsgrad: 100,
                } as BeregningsresultatPeriodeAndelDto,
              ],
            },
          ] as PeriodeMedId[]
        }
        groups={[]}
        kodeverkNavnFraKode={kodeverkNavnFraKode}
        arbeidsgiverOpplysningerPerId={{}}
        isUngdomsytelseFagsak={false}
      />,
    );

    expect(screen.getByLabelText('Forrige periode')).toBeInTheDocument();
    expect(screen.getByLabelText('Neste periode')).toBeInTheDocument();
  });
});
