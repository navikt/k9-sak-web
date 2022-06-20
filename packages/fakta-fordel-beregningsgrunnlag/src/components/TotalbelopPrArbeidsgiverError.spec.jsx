import { expect } from 'chai';
import { AAP_ARBEIDSGIVER_KEY, lagTotalInntektArbeidsforholdList } from './TotalbelopPrArbeidsgiverError';

const getKodeverknavn = (kode, kodeverk) => {
  if (kode === 'AAP') {
    return 'Arbeidsavklaringspenger';
  }
  return '';
};

const arbeidsgiverOpplysningerPerId = {
  33334444234123: {
    identifikator: '33334444234123',
    referanse: '33334444234123',
    navn: 'Sopra Steria',
    fødselsdato: null,
  },
};

describe('<TotalbelopPrArbeidsgiverError>', () => {
  it('skal lage liste for to arbeidsforhold for samme arbeidsgiver', () => {
    const andeler = [
      {
        arbeidsgiverIdent: '33334444234123',
        arbeidsforholdId: null,
        fastsattBelop: '10 000',
        beregningsgrunnlagPrAar: '20 000',
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        arbeidsgiverIdent: '33334444234123',
        arbeidsforholdId: null,
        fastsattBelop: '20 000',
        inntektskategori: 'ARBEIDSTAKER',
      },
    ];
    const fellesGrunnlag = lagTotalInntektArbeidsforholdList(
      andeler,
      () => true,
      () => false,
      getKodeverknavn,
      arbeidsgiverOpplysningerPerId,
    );
    expect(fellesGrunnlag.length).to.equal(1);
    expect(fellesGrunnlag[0].fastsattBelop).to.equal(30000);
    expect(fellesGrunnlag[0].beregningsgrunnlagPrAar).to.equal(20000);
    expect(fellesGrunnlag[0].arbeidsgiverNavn).to.equal('Sopra Steria (33334444234123)');
    expect(fellesGrunnlag[0].key).to.equal('Sopra Steria (33334444234123)');
  });

  it('skal lage liste for AAP og arbeidsgiver som søker refusjon som overstiger beregningsgrunnlag', () => {
    const andeler = [
      {
        arbeidsforholdType: 'AAP',
        fastsattBelop: '10 000',
        beregningsgrunnlagPrAar: '20 000',
        inntektskategori: 'ARBEIDSAVKLARINGSPENGER',
      },
      {
        arbeidsgiverIdent: '33334444234123',
        arbeidsforholdId: null,
        fastsattBelop: '20 000',
        beregningsgrunnlagPrAar: '30 000',
        inntektskategori: 'ARBEIDSTAKER',
      },
    ];
    const fellesGrunnlag = lagTotalInntektArbeidsforholdList(
      andeler,
      () => false,
      () => true,
      getKodeverknavn,
      arbeidsgiverOpplysningerPerId,
    );
    expect(fellesGrunnlag.length).to.equal(3);
    expect(fellesGrunnlag[0].fastsattBelop).to.equal(30000);
    expect(fellesGrunnlag[0].beregningsgrunnlagPrAar).to.equal(50000);
    expect(fellesGrunnlag[0].arbeidsgiverNavn).to.equal('Sopra Steria (33334444234123)');
    expect(fellesGrunnlag[0].key).to.equal(AAP_ARBEIDSGIVER_KEY);

    expect(fellesGrunnlag[1].fastsattBelop).to.equal(10000);
    expect(fellesGrunnlag[1].beregningsgrunnlagPrAar).to.equal(20000);
    expect(fellesGrunnlag[1].arbeidsgiverNavn).to.equal('Arbeidsavklaringspenger');
    expect(fellesGrunnlag[1].key).to.equal('Arbeidsavklaringspenger');

    expect(fellesGrunnlag[2].fastsattBelop).to.equal(20000);
    expect(fellesGrunnlag[2].beregningsgrunnlagPrAar).to.equal(30000);
    expect(fellesGrunnlag[2].arbeidsgiverNavn).to.equal('Sopra Steria (33334444234123)');
    expect(fellesGrunnlag[2].key).to.equal('Sopra Steria (33334444234123)');
  });

  it('skal ikkje lage liste for nytt arbeidsforhold', () => {
    const andeler = [
      {
        arbeidsgiverIdent: '33334444234123',
        arbeidsforholdId: null,
        fastsattBelop: '10 000',
        beregningsgrunnlagPrAar: '20 000',
        inntektskategori: 'ARBEIDSTAKER',
        nyttArbeidsforhold: true,
      },
      {
        arbeidsgiverIdent: '33334444234123',
        arbeidsforholdId: null,
        fastsattBelop: '20 000',
        inntektskategori: 'ARBEIDSTAKER',
        nyttArbeidsforhold: true,
      },
    ];
    const fellesGrunnlag = lagTotalInntektArbeidsforholdList(
      andeler,
      () => true,
      () => false,
      getKodeverknavn,
      arbeidsgiverOpplysningerPerId,
    );
    expect(fellesGrunnlag.length).to.equal(0);
  });
});
