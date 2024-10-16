import { render, screen } from '@testing-library/react';
import { TilkjentYtelse } from './TilkjentYtelse';

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
    render(
      <TilkjentYtelse
        items={[
          {
            tom: '2018-10-01',
            fom: '2018-02-02',
            dagsats: 10000,
            id: 1,
            andeler: [
              {
                inntektskategori: 'ARBEIDSTAKER', // INNTEKTSKATEGORI
                arbeidsgiver: { arbeidsgiverOrgnr: '973861778' },
                arbeidsgiverOrgnr: '',
                arbeidsgiverPersonIdent: '',
                aktivitetStatus: 'AT',
                eksternArbeidsforholdId: '',
                refusjon: 0,
                tilSoker: 1846,
                utbetalingsgrad: 100,
              },
            ],
          },
        ]}
        kodeverkNavnFraKode={kodeverkNavnFraKode}
        arbeidsgiverOpplysningerPerId={{}}
        personopplysninger={{ aktoerId: '123', fnr: '12345678901' }}
      />,
    );

    expect(screen.getByText('Forrige periode')).toBeInTheDocument();
    expect(screen.getByText('Neste periode')).toBeInTheDocument();
  });
});
