import { expect } from 'chai';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { erSøktForAndelISøknadsperiode, finnFrisinnperioderSomSkalVises } from './FrisinnUtils';

const lagBgPeriode = (beregningsgrunnlagPeriodeFom, beregningsgrunnlagPeriodeTom) => ({
  beregningsgrunnlagPeriodeFom,
  beregningsgrunnlagPeriodeTom,
});

const lagFrisinnAndel = (status, beløp) => ({
  oppgittInntekt: beløp,
  statusSøktFor: status,
});

const lagFrisinnPeriode = (fom, tom, frisinnAndeler) => ({
  fom,
  tom,
  frisinnAndeler,
});

const lagFrisinngrunnlag = frisinnPerioder => ({
  frisinnPerioder,
});

const lagFrisinngrunnlagBG = frisinnPerioder => ({
  ytelsesspesifiktGrunnlag: {
    frisinnPerioder,
  },
});

const lagBehandling = kode => ({
  id: 1,
  versjon: 1,
  behandlingÅrsaker: [
    {
      behandlingArsakType: {
        kode,
      },
      erAutomatiskRevurdering: false,
      manueltOpprettet: false,
    },
  ],
  sprakkode: 'NB',
});

describe('<FrisinnUtils>', () => {
  it('Skal finne at det er søkt frilans når kun en måned', () => {
    const andeler = [lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000)];
    const perioder = [lagFrisinnPeriode('2020-03-28', '2020-04-30', andeler)];
    const erSøktIPeriode = erSøktForAndelISøknadsperiode(
      aktivitetStatus.FRILANSER,
      lagBgPeriode('2020-03-28', '2020-04-30'),
      lagFrisinngrunnlag(perioder),
    );
    expect(erSøktIPeriode).to.have.equal(true);
  });
  it('Skal finne at det er søkt næring når kun en måned', () => {
    const andeler = [lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000)];
    const perioder = [lagFrisinnPeriode('2020-03-28', '2020-04-30', andeler)];
    const erSøktIPeriode = erSøktForAndelISøknadsperiode(
      aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
      lagBgPeriode('2020-03-28', '2020-04-30'),
      lagFrisinngrunnlag(perioder),
    );
    expect(erSøktIPeriode).to.have.equal(true);
  });
  it('Skal finne at det er søkt næring når splitt i april for frilans', () => {
    const andeler1 = [lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000)];
    const andeler2 = [
      lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000),
      lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000),
    ];
    const perioder = [
      lagFrisinnPeriode('2020-03-28', '2020-03-31', andeler1),
      lagFrisinnPeriode('2020-04-01', '2020-04-30', andeler2),
    ];
    const erSøktIPeriode = erSøktForAndelISøknadsperiode(
      aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
      lagBgPeriode('2020-03-28', '2020-03-31'),
      lagFrisinngrunnlag(perioder),
    );
    expect(erSøktIPeriode).to.have.equal(true);
  });
  it('Skal finne korrekt frisinnperiode når flere er tilgjengelige', () => {
    const andeler1 = [lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000)];
    const andeler2 = [
      lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000),
      lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000),
    ];
    const perioder = [
      lagFrisinnPeriode('2020-04-01', '2020-04-15', andeler1),
      lagFrisinnPeriode('2020-04-16', '2020-04-30', andeler2),
    ];
    const erSøktIPeriode = erSøktForAndelISøknadsperiode(
      aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
      lagBgPeriode('2020-04-01', '2020-04-30'),
      lagFrisinngrunnlag(perioder),
    );
    expect(erSøktIPeriode).to.have.equal(true);
  });
  it('Skal returnere false når status ikke søkt om', () => {
    const andeler = [lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000)];
    const perioder = [lagFrisinnPeriode('2020-04-01', '2020-04-30', andeler)];
    const erSøktIPeriode = erSøktForAndelISøknadsperiode(
      aktivitetStatus.FRILANSER,
      lagBgPeriode('2020-04-01', '2020-04-30'),
      lagFrisinngrunnlag(perioder),
    );
    expect(erSøktIPeriode).to.have.equal(false);
  });
  it('Skal finne korrekt frisinnperiode når flere er tilgjengelige innen samme måned', () => {
    const andeler1 = [lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000)];
    const andeler2 = [
      lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000),
      lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000),
    ];
    const perioder = [
      lagFrisinnPeriode('2020-04-01', '2020-04-15', andeler1),
      lagFrisinnPeriode('2020-04-16', '2020-04-30', andeler2),
    ];
    const erSøktIPeriode = erSøktForAndelISøknadsperiode(
      aktivitetStatus.FRILANSER,
      lagBgPeriode('2020-04-01', '2020-04-15'),
      lagFrisinngrunnlag(perioder),
    );
    expect(erSøktIPeriode).to.have.equal(true);
  });
  it('Skal finne korrekt frisinnperiode når flere er tilgjengelige og krysser måneder', () => {
    const andeler1 = [lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000)];
    const andeler2 = [
      lagFrisinnAndel(aktivitetStatus.FRILANSER, 1000),
      lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000),
    ];
    const perioder = [
      lagFrisinnPeriode('2020-04-01', '2020-04-15', andeler1),
      lagFrisinnPeriode('2020-04-16', '2020-04-30', andeler2),
      lagFrisinnPeriode('2020-05-01', '2020-05-31', andeler2),
    ];
    const erSøktIPeriode = erSøktForAndelISøknadsperiode(
      aktivitetStatus.FRILANSER,
      lagBgPeriode('2020-05-01', '2020-05-31'),
      lagFrisinngrunnlag(perioder),
    );
    expect(erSøktIPeriode).to.have.equal(true);
  });
  it('Skal finne frisinnperioder som skal vises når kun en periode ikke revurdering fra bruker', () => {
    const andeler1 = [lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000)];
    const perioder = [lagFrisinnPeriode('2020-04-01', '2020-04-30', andeler1)];
    const frisinnPerioder = finnFrisinnperioderSomSkalVises(lagFrisinngrunnlagBG(perioder), lagBehandling('dummy'));
    expect(frisinnPerioder).to.have.length(1);
    expect(frisinnPerioder[0].fom).to.have.equal('2020-04-01');
    expect(frisinnPerioder[0].tom).to.have.equal('2020-04-30');
  });
  it('Skal finne frisinnperioder som skal vises når flere perioder ikke revurdering fra bruker', () => {
    const andeler1 = [lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000)];
    const perioder = [
      lagFrisinnPeriode('2020-04-01', '2020-04-30', andeler1),
      lagFrisinnPeriode('2020-05-01', '2020-05-31', andeler1),
    ];
    const frisinnPerioder = finnFrisinnperioderSomSkalVises(lagFrisinngrunnlagBG(perioder), lagBehandling('dummy'));
    expect(frisinnPerioder).to.have.length(2);
    expect(frisinnPerioder[0].fom).to.have.equal('2020-04-01');
    expect(frisinnPerioder[0].tom).to.have.equal('2020-04-30');
    expect(frisinnPerioder[1].fom).to.have.equal('2020-05-01');
    expect(frisinnPerioder[1].tom).to.have.equal('2020-05-31');
  });
  it('Skal finne frisinnperioder som skal vises når flere perioder revurdering fra bruker', () => {
    const andeler1 = [lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000)];
    const perioder = [
      lagFrisinnPeriode('2020-04-01', '2020-04-30', andeler1),
      lagFrisinnPeriode('2020-05-01', '2020-05-31', andeler1),
    ];
    const frisinnPerioder = finnFrisinnperioderSomSkalVises(
      lagFrisinngrunnlagBG(perioder),
      lagBehandling(behandlingArsakType.RE_ENDRING_FRA_BRUKER),
    );
    expect(frisinnPerioder).to.have.length(1);
    expect(frisinnPerioder[0].fom).to.have.equal('2020-05-01');
    expect(frisinnPerioder[0].tom).to.have.equal('2020-05-31');
  });
  it('Skal finne frisinnperioder som skal vises når revurdering fra bruker og perioden er splittet', () => {
    const andeler1 = [lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000)];
    const perioder = [
      lagFrisinnPeriode('2020-05-01', '2020-05-17', andeler1),
      lagFrisinnPeriode('2020-05-18', '2020-05-31', andeler1),
    ];
    const frisinnPerioder = finnFrisinnperioderSomSkalVises(
      lagFrisinngrunnlagBG(perioder),
      lagBehandling(behandlingArsakType.RE_ENDRING_FRA_BRUKER),
    );
    expect(frisinnPerioder).to.have.length(2);
    expect(frisinnPerioder[0].fom).to.have.equal('2020-05-01');
    expect(frisinnPerioder[0].tom).to.have.equal('2020-05-17');
    expect(frisinnPerioder[1].fom).to.have.equal('2020-05-18');
    expect(frisinnPerioder[1].tom).to.have.equal('2020-05-31');
  });
  it('Skal finne frisinnperioder som skal vises når flere perioder revurdering fra bruker og perioden er splittet', () => {
    const andeler1 = [lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000)];
    const perioder = [
      lagFrisinnPeriode('2020-04-01', '2020-04-30', andeler1),
      lagFrisinnPeriode('2020-05-01', '2020-05-17', andeler1),
      lagFrisinnPeriode('2020-05-18', '2020-05-31', andeler1),
    ];
    const frisinnPerioder = finnFrisinnperioderSomSkalVises(
      lagFrisinngrunnlagBG(perioder),
      lagBehandling(behandlingArsakType.RE_ENDRING_FRA_BRUKER),
    );
    expect(frisinnPerioder).to.have.length(2);
    expect(frisinnPerioder[0].fom).to.have.equal('2020-05-01');
    expect(frisinnPerioder[0].tom).to.have.equal('2020-05-17');
    expect(frisinnPerioder[1].fom).to.have.equal('2020-05-18');
    expect(frisinnPerioder[1].tom).to.have.equal('2020-05-31');
  });
  it('Skal finne frisinnperioder som skal vises når flere perioder ikke revurdering fra bruker og perioden er splittet', () => {
    const andeler1 = [lagFrisinnAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 1000)];
    const perioder = [
      lagFrisinnPeriode('2020-04-01', '2020-04-30', andeler1),
      lagFrisinnPeriode('2020-05-01', '2020-05-17', andeler1),
      lagFrisinnPeriode('2020-05-18', '2020-05-31', andeler1),
    ];
    const frisinnPerioder = finnFrisinnperioderSomSkalVises(lagFrisinngrunnlagBG(perioder), lagBehandling('dummy'));
    expect(frisinnPerioder).to.have.length(3);
    expect(frisinnPerioder[0].fom).to.have.equal('2020-04-01');
    expect(frisinnPerioder[0].tom).to.have.equal('2020-04-30');
    expect(frisinnPerioder[1].fom).to.have.equal('2020-05-01');
    expect(frisinnPerioder[1].tom).to.have.equal('2020-05-17');
    expect(frisinnPerioder[2].fom).to.have.equal('2020-05-18');
    expect(frisinnPerioder[2].tom).to.have.equal('2020-05-31');
  });
});
