import { expect } from 'chai';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import {
  compareAndeler,
  kanIkkjeHaNullBeregningsgrunnlagError,
  skalVereLikFordelingMessage,
  tomErrorMessage,
  ulikeAndelerErrorMessage,
  validateAgainstBeregningsgrunnlag,
  validateAndeler,
  validateFastsattBelop,
  validateSumFastsattBelop,
  validateUlikeAndeler,
} from './ValidateAndelerUtils';

const skalValidereMotRapportert = () => true;

const arbeidsgiverOpplysningerPerId = {
  36363463463: {
    identifikator: '36363463463',
    referanse: '36363463463',
    navn: 'Andersen flyttebyrå',
    fødselsdato: null,
  },
  658568568: {
    identifikator: '658568568',
    referanse: '658568568',
    navn: 'Torgersen flyttebyrå',
    fødselsdato: null,
  },
  2342353525: {
    identifikator: '2342353525',
    referanse: '2342353525',
    navn: 'Arbeidsgiver 1',
    fødselsdato: null,
  },
};

describe('<ValidateAndelerUtils>', () => {

  it('skal returnere 0 for lik andelsinfo og lik inntektskategori', () => {
    const andeler = [
      {
        andelsinfo: 'Andelsinfo1',
        inntektskategori: 'Inntektskategori1',
      },
      {
        andelsinfo: 'Andelsinfo1',
        inntektskategori: 'Inntektskategori1',
      },
    ];
    const compare = compareAndeler(andeler[0], andeler[1]);
    expect(compare).to.equal(0);
  });

  it('skal returnere -1 for lik andelsinfo og ulik inntektskategori', () => {
    const andeler = [
      {
        andelsinfo: 'Andelsinfo1',
        inntektskategori: 'Inntektskategori1',
      },
      {
        andelsinfo: 'Andelsinfo1',
        inntektskategori: 'Inntektskategori2',
      },
    ];
    const compare = compareAndeler(andeler[0], andeler[1]);
    expect(compare).to.equal(-1);
  });

  it('skal returnere 1 for lik andelsinfo og ulik inntektskategori motsatt rekkefølge', () => {
    const andeler = [
      {
        andelsinfo: 'Andelsinfo1',
        inntektskategori: 'Inntektskategori1',
      },
      {
        andelsinfo: 'Andelsinfo1',
        inntektskategori: 'Inntektskategori2',
      },
    ];
    const compare = compareAndeler(andeler[1], andeler[0]);
    expect(compare).to.equal(1);
  });

  it('skal returnere -1 for ulik andelsinfo og lik inntektskategori', () => {
    const andeler = [
      {
        andelsinfo: 'Andelsinfo1',
        inntektskategori: 'Inntektskategori1',
      },
      {
        andelsinfo: 'Andelsinfo2',
        inntektskategori: 'Inntektskategori1',
      },
    ];
    const compare = compareAndeler(andeler[0], andeler[1]);
    expect(compare).to.equal(-1);
  });

  it('skal returnere 1 for ulik andelsinfo og lik inntektskategori motsatt rekkefølge', () => {
    const andeler = [
      {
        andelsinfo: 'Andelsinfo1',
        inntektskategori: 'Inntektskategori1',
      },
      {
        andelsinfo: 'Andelsinfo2',
        inntektskategori: 'Inntektskategori1',
      },
    ];
    const compare = compareAndeler(andeler[1], andeler[0]);
    expect(compare).to.equal(1);
  });

  it('skal returnere -1 for ulik andelsinfo og ulik inntektskategori motsatt rekkefølge', () => {
    const andeler = [
      {
        andelsinfo: 'Andelsinfo1',
        inntektskategori: 'Inntektskategori1',
      },
      {
        andelsinfo: 'Andelsinfo2',
        inntektskategori: 'Inntektskategori2',
      },
    ];
    const compare = compareAndeler(andeler[0], andeler[1]);
    expect(compare).to.equal(-1);
  });

  it('skal returnere 1 for ulik andelsinfo og ulik inntektskategori motsatt rekkefølge', () => {
    const andeler = [
      {
        andelsinfo: 'Andelsinfo1',
        inntektskategori: 'Inntektskategori1',
      },
      {
        andelsinfo: 'Andelsinfo2',
        inntektskategori: 'Inntektskategori2',
      },
    ];
    const compare = compareAndeler(andeler[1], andeler[0]);
    expect(compare).to.equal(1);
  });

  it('skal ikkje gi error om det er ingen andeler lagt til av saksbehandler og ingen har lik inntektskategori og andelsnr', () => {
    const andeler = [
      {
        andelsnr: 1,
        andel: 'Virksomheten 1',
        nyAndel: false,
        lagtTilAvSaksbehandler: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        inntektskategori: 'ARBEIDSTAKER',
        arbeidsforholdId: '2974239',
      },
      {
        andelsnr: 2,
        andel: 'Virksomheten 2',
        nyAndel: false,
        lagtTilAvSaksbehandler: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        inntektskategori: 'ARBEIDSTAKER',
        arbeidsforholdId: '433f34',
      },
      {
        andelsnr: 3,
        andel: 'Virksomheten 3',
        nyAndel: false,
        lagtTilAvSaksbehandler: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        inntektskategori: 'ARBEIDSTAKER',
        arbeidsforholdId: 'egg4g232',
      },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.equal(null);
  });

  it('skal ikkje gi error om det er andeler lagt til av saksbehandler og ingen har lik inntektskategori og andelsnr', () => {
    const andeler = [
      {
        andelsnr: 1,
        andel: 'Virksomheten 1',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
        arbeidsforholdId: '433f34',
      },
      {
        andelsnr: 2,
        andel: 'Virksomheten 2',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
        arbeidsforholdId: '34r343f',
      },
      {
        andelsnr: null,
        andel: '2',
        nyAndel: true,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'ARBEIDSTAKER_SJØMANN',
        arbeidsforholdId: '34r343f',
      },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.equal(null);
  });

  it('skal gi error om det er nye andeler to har lik inntektskategori og andelsnr', () => {
    const andeler = [
      {
        andelsnr: 1,
        andel: 'Virksomheten 1',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
        arbeidsforholdId: '353453',
      },
      {
        andelsnr: 2,
        andel: 'Virksomheten 2',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
        arbeidsforholdId: '433f34',
      },
      {
        andelsnr: null,
        andel: '2',
        nyAndel: true,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'ARBEIDSTAKER',
        arbeidsforholdId: '433f34',
      },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal ikkje gi error om to andeler har lik inntektskategori men ulik arbeidsforholdId', () => {
    const andeler = [
      {
        andelsnr: 1,
        andel: 'Virksomheten 1',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
        arbeidsforholdId: '353453',
      },
      {
        andelsnr: 2,
        andel: 'Virksomheten 1',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
        arbeidsforholdId: '433f34',
      },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.equal(null);
  });

  it('skal gi error om det er nye andeler to har lik inntektskategori og andelsnr når det finnes to eksisterende andeler med samme virksomhet', () => {
    const andeler = [
      {
        andelsnr: 1,
        andel: 'Virksomheten 1 (...fesf342334)',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 2,
        andel: 'Virksomheten 2',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 3,
        andel: 'Virksomheten 1 (...fesf342334)',
        aktivitetStatus: 'ARBEIDSTAKER',
        nyAndel: false,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'SJØMANN',
      },
      {
        andelsnr: null,
        andel: '1',
        nyAndel: true,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'SJØMANN',
      },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal ikkje gi error om det er nye andeler der to har lik andelstype og ulik inntektskategori', () => {
    const andeler = [
      {
        andelsnr: 1,
        andel: 'Virksomheten 1',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 2,
        andel: 'Virksomheten 2',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: null,
        andel: 'BRUKERS_ANDEL',
        nyAndel: true,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: null,
        andel: 'BRUKERS_ANDEL',
        nyAndel: true,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'FRILANSER',
      },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.equal(null);
  });

  it('skal gi error om det er nye andeler der to har lik inntektskategori og andelstype', () => {
    const andeler = [
      {
        andelsnr: 1,
        andel: 'Virksomheten 1',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 2,
        andel: 'Virksomheten 2',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: null,
        andel: 'BRUKERS_ANDEL',
        nyAndel: true,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: null,
        andel: 'BRUKERS_ANDEL',
        nyAndel: true,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'ARBEIDSTAKER',
      },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal gi error om det er ingen nye andeler, men andel lagt til av saksbehandler der to har lik inntektskategori og andelstype', () => {
    const andeler = [
      {
        andelsnr: 1,
        andel: 'Virksomheten 1',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 2,
        andel: 'Virksomheten 2',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 3,
        andel: 'Brukers andel',
        nyAndel: false,
        aktivitetStatus: 'BA',
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 4,
        andel: 'Brukers andel',
        nyAndel: false,
        aktivitetStatus: 'BA',
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'ARBEIDSTAKER',
      },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal gi error om det er ein ny brukers andel, og ein eksisterende der begge har lik inntektskategori', () => {
    const andeler = [
      {
        andelsnr: 1,
        andel: 'Virksomheten 1',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 2,
        andel: 'Virksomheten 2',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 3,
        andel: 'Brukers andel',
        aktivitetStatus: 'BA',
        nyAndel: false,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 4,
        andel: 'BRUKERS_ANDEL',
        nyAndel: true,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'ARBEIDSTAKER',
      },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal gi error om det er ein ny egen næring, og ein selvstendig næringsdrivende lagt til tidligere der begge har lik inntektskategori', () => {
    const andeler = [
      {
        andelsnr: 1,
        andel: 'Virksomheten 1',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 2,
        andel: 'Virksomheten 2',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 3,
        andel: 'Selvstendig næringsdrivende',
        aktivitetStatus: 'SN',
        nyAndel: false,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 4,
        andel: 'EGEN_NÆRING',
        nyAndel: true,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'ARBEIDSTAKER',
      },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal gi error om det er ein ny egen næring, og ein eksisterende selvstendig næringsdrivende der begge har lik inntektskategori', () => {
    const andeler = [
      {
        andelsnr: 1,
        andel: 'Virksomheten 1',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 2,
        andel: 'Virksomheten 2',
        nyAndel: false,
        aktivitetStatus: 'ARBEIDSTAKER',
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 3,
        andel: 'Selvstendig næringsdrivende',
        aktivitetStatus: 'SN',
        nyAndel: false,
        lagtTilAvSaksbehandler: false,
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        andelsnr: 4,
        andel: 'EGEN_NÆRING',
        nyAndel: true,
        lagtTilAvSaksbehandler: true,
        inntektskategori: 'ARBEIDSTAKER',
      },
    ];
    const ulikeAndelerError = validateUlikeAndeler(andeler);
    expect(ulikeAndelerError).to.have.length(1);
    expect(ulikeAndelerError[0].id).to.equal(ulikeAndelerErrorMessage()[0].id);
  });

  it('skal gi error om fastsatt beløp er ulik oppgitt sum', () => {
    const values = [
      {
        fastsattBelop: '10 000',
      },
      {
        fastsattBelop: '20 000',
      },
      {
        fastsattBelop: '10 000',
      },
      {
        fastsattBelop: '10 000',
      },
    ];
    const fastsattError = validateSumFastsattBelop(values, 40000);
    expect(fastsattError).to.have.length(2);
    expect(fastsattError[0].id).to.equal(skalVereLikFordelingMessage()[0].id);
    expect(fastsattError[1].fordeling).to.equal('40 000');
  });

  it('skal ikkje gi error om fastsatt beløp er lik oppgitt sum', () => {
    const values = [
      {
        harPeriodeAarsakGraderingEllerRefusjon: true,
        fastsattBelop: '10 000',
      },
      {
        harPeriodeAarsakGraderingEllerRefusjon: true,
        fastsattBelop: '20 000',
      },
      {
        harPeriodeAarsakGraderingEllerRefusjon: true,
        fastsattBelop: '10 000',
      },
      {
        harPeriodeAarsakGraderingEllerRefusjon: true,
        fastsattBelop: '10 000',
      },
    ];
    const fastsattError = validateSumFastsattBelop(values, 50000);
    expect(fastsattError).to.equal(null);
  });

  it('skal ikkje gi error om fastsatt beløp og read only beløp er lik sum', () => {
    const values = [
      {
        andelsnr: 1,
        harPeriodeAarsakGraderingEllerRefusjon: true,
        fastsattBelop: '10 000',
        readOnlyBelop: '50 000',
      },
      {
        harPeriodeAarsakGraderingEllerRefusjon: true,
        andelsnr: 2,
        fastsattBelop: '20 000',
        readOnlyBelop: '100 000',
      },
      {
        harPeriodeAarsakGraderingEllerRefusjon: false,
        andelsnr: 3,
        fastsattBelop: '40 000',
        readOnlyBelop: '10 000',
      },
      {
        harPeriodeAarsakGraderingEllerRefusjon: false,
        andelsnr: 4,
        fastsattBelop: '15 000',
        readOnlyBelop: '10 000',
      },
    ];
    const fastsattError = validateSumFastsattBelop(values, 50000);
    expect(fastsattError).to.equal(null);
  });

  it('skal gi error om fastsatt beløp og read only beløp er ulik sum', () => {
    const skalRedigereInntekt = andel => {
      if (andel.andelsnr <= 2) {
        return true;
      }
      return false;
    };

    const values = [
      {
        andelsnr: 1,
        fastsattBelop: '50 000',
        readOnlyBelop: '10 000',
      },
      {
        andelsnr: 2,
        fastsattBelop: '100 000',
        readOnlyBelop: '20 000',
      },
      {
        andelsnr: 3,
        fastsattBelop: '10 000',
        readOnlyBelop: '40 000',
      },
      {
        andelsnr: 4,
        fastsattBelop: '10 000',
        readOnlyBelop: '15 000',
      },
    ];
    const fastsattError = validateSumFastsattBelop(values, 50000, skalRedigereInntekt);
    expect(fastsattError).to.have.length(2);
    expect(fastsattError[0].id).to.equal(skalVereLikFordelingMessage()[0].id);
    expect(fastsattError[1].fordeling).to.equal('50 000');
  });

  it('skal gi error om total beløp for arbeidsforhold overstiger rapportert beløp', () => {
    const values = [
      {
        harPeriodeAarsakGraderingEllerRefusjon: true,
        andel: 'Arbeidsgiver 1',
        fastsattBelop: '10 000',
        arbeidsgiverIdent: '2342353525',
        arbeidsperiodeFom: '2016-01-01',
        arbeidsforholdId: '3r4h3uihr43',
        eksternArbeidsforholdId: '56789',
        beregningsgrunnlagPrAar: '10 000',
        inntektskategori: 'ARBEIDSTAKER',
      },
      {
        harPeriodeAarsakGraderingEllerRefusjon: true,
        andel: 'Arbeidsgiver 1',
        fastsattBelop: '20 000',
        arbeidsgiverIdent: '2342353525',
        arbeidsperiodeFom: '2016-01-01',
        arbeidsforholdId: '3r4h3uihr43',
        eksternArbeidsforholdId: '56789',
        beregningsgrunnlagPrAar: '10 000',
        inntektskategori: 'FRILANSER',
      },
    ];
    const fastsattError = validateAndeler(values, () => true, undefined, arbeidsgiverOpplysningerPerId);
    expect(fastsattError['0'].fastsattBelop[0].id).to.equal(tomErrorMessage()[0].id);
    expect(fastsattError['1'].fastsattBelop[0].id).to.equal(tomErrorMessage()[0].id);
    /* eslint no-underscore-dangle: ["error", { "allow": ["_error"] }] */
    expect(fastsattError._error.props.totalInntektPrArbeidsforhold.length).to.equal(1);
    expect(fastsattError._error.props.totalInntektPrArbeidsforhold[0].key).to.equal(
      'Arbeidsgiver 1 (2342353525)...6789',
    );
    expect(fastsattError._error.props.totalInntektPrArbeidsforhold[0].fastsattBelop).to.equal(30000);
    expect(fastsattError._error.props.totalInntektPrArbeidsforhold[0].beregningsgrunnlagPrAar).to.equal(20000);
  });

  it('skal validere mot beregningsgrunnlagPrAar for arbeidsforhold som tilkommer før skjæringstidspunktet', () => {
    const andelValue = {
      andel: 'Arbeidsgiver 1',
      arbeidsgiverIdent: '2342353525',
      arbeidsforholdId: '3r4h3uihr43',
      eksternArbeidsforholdId: '56789',
    };
    const inntektList = [
      {
        key: 'Arbeidsgiver 1 (2342353525)...6789',
        beregningsgrunnlagPrAar: 10000,
        fastsattBelop: 20000,
      },
    ];
    const fastsattError = validateAgainstBeregningsgrunnlag(
      andelValue,
      inntektList,
      skalValidereMotRapportert,
      () => '',
      arbeidsgiverOpplysningerPerId,
    );
    expect(fastsattError[0].id).to.equal(tomErrorMessage()[0].id);
  });

  it('skal ikkje validere mot beløp om det ikkje finnes ein matchende arbeidsforholdInntektMapping', () => {
    const andelValue = {
      andel: 'Arbeidsgiver 1',
      arbeidsgiverIdent: '2342353525',
      arbeidsforholdId: '3r4h3uihr43',
    };
    const inntektList = [
      {
        key: 'Arbeidsgiver 2 (35354353) ...5435',
        beregningsgrunnlagPrAar: null,
        fastsattBelop: 20000,
      },
    ];
    const fastsattError = validateAgainstBeregningsgrunnlag(
      andelValue,
      inntektList,
      skalValidereMotRapportert,
      () => '',
      arbeidsgiverOpplysningerPerId,
    );
    expect(fastsattError).to.equal(null);
  });

  it('skal returnere required error om fastsatt beløp ikkje er satt', () => {
    const andelValue = {
      andel: 'Arbeidsgiver 1',
      arbeidsgiverIdent: '2342353525',
      arbeidsforholdId: '3r4h3uihr43',
      fastsattBelop: '',
    };
    const inntektList = [
      {
        key: 'Arbeidsgiver 1 (2342353525) ...hr43',
        beregningsgrunnlagPrAar: null,
        fastsattBelop: 20000,
      },
    ];
    const fastsattError = validateFastsattBelop(
      andelValue,
      inntektList,
      skalValidereMotRapportert,
      () => '',
      arbeidsgiverOpplysningerPerId,
      {},
    );
    expect(fastsattError[0].id).to.equal(isRequiredMessage()[0].id);
  });

  it('skal returnere error om det er satt 0 i beregningsgrunnlag for andel med gradering og arbeidsforhold ikke opphørt', () => {
    const andelValue = {
      andel: 'Selvstendig næringsgivende',
      fastsattBelop: '0',
      andelIArbeid: '50.00',
      arbeidsperiodeTom: null,
    };
    const inntektList = [
      {
        key: 'Selvstendig næringsgivende',
        beregningsgrunnlagPrAar: null,
        fastsattBelop: 0,
      },
    ];
    const periodeDato = {
      fom: '2020-01-01',
      tom: null,
    };
    const fastsattError = validateFastsattBelop(
      andelValue,
      inntektList,
      () => false,
      () => '',
      arbeidsgiverOpplysningerPerId,
      periodeDato,
    );
    expect(fastsattError[0].id).to.equal(kanIkkjeHaNullBeregningsgrunnlagError()[0].id);
  });

  it('skal returnere error om det er satt 0 i beregningsgrunnlag for andel med gradering i deler av perioden og arbeidsforhold ikke opphørt', () => {
    const andelValue = {
      andel: 'Selvstendig næringsgivende',
      fastsattBelop: '0',
      andelIArbeid: '0 - 50',
      arbeidsperiodeTom: '2020-12-01',
    };
    const inntektList = [
      {
        key: 'Selvstendig næringsgivende',
        beregningsgrunnlagPrAar: null,
        fastsattBelop: 0,
      },
    ];
    const periodeDato = {
      fom: '2020-01-01',
      tom: null,
    };
    const fastsattError = validateFastsattBelop(
      andelValue,
      inntektList,
      () => false,
      () => '',
      arbeidsgiverOpplysningerPerId,
      periodeDato,
    );
    expect(fastsattError[0].id).to.equal(kanIkkjeHaNullBeregningsgrunnlagError()[0].id);
  });

  it('skal ikkje returnere error om det er satt 0 i beregningsgrunnlag for andel med uten gradering og arbeidsforhold ikke opphørt', () => {
    const andelValue = {
      andel: 'Selvstendig næringsgivende',
      fastsattBelop: '0',
      andelIArbeid: '0',
      arbeidsperiodeTom: undefined,
    };
    const inntektList = [
      {
        key: 'Selvstendig næringsgivende',
        beregningsgrunnlagPrAar: null,
        fastsattBelop: 0,
      },
    ];
    const periodeDato = {
      fom: '2015-01-01',
      tom: null,
    };
    const fastsattError = validateFastsattBelop(
      andelValue,
      inntektList,
      () => false,
      () => '',
      arbeidsgiverOpplysningerPerId,
      periodeDato,
    );
    expect(fastsattError).to.equal(null);
  });

  it('skal ikkje returnere error om det er satt 0 i beregningsgrunnlag for andel med tilgjengelig informasjon om gradering', () => {
    const andelValue = {
      andel: 'Selvstendig næringsgivende',
      fastsattBelop: '0',
      andelIArbeid: '',
    };
    const inntektList = [
      {
        key: 'Selvstendig næringsgivende',
        beregningsgrunnlagPrAar: null,
        fastsattBelop: 0,
      },
    ];
    const fastsattError = validateFastsattBelop(
      andelValue,
      inntektList,
      () => false,
      () => '',
      arbeidsgiverOpplysningerPerId,
      {},
    );
    expect(fastsattError).to.equal(null);
  });

  it('skal ikke returnere error om det er satt 0 i beregningsgrunnlag for andel med gradering i deler av perioden og arbeidsforhold er opphørt', () => {
    const andelValue = {
      andel: 'Selvstendig næringsgivende',
      fastsattBelop: '0',
      andelIArbeid: '0 - 50',
      arbeidsperiodeTom: '2019-12-31',
    };
    const inntektList = [
      {
        key: 'Selvstendig næringsgivende',
        beregningsgrunnlagPrAar: null,
        fastsattBelop: 0,
      },
    ];
    const periodeDato = {
      fom: '2020-01-01',
      tom: null,
    };
    const fastsattError = validateFastsattBelop(
      andelValue,
      inntektList,
      () => false,
      () => '',
      arbeidsgiverOpplysningerPerId,
      periodeDato,
    );
    expect(fastsattError).to.equal(null);
  });
});
