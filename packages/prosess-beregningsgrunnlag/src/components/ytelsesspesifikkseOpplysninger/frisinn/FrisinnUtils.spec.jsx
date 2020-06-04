import { expect } from 'chai';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { erSøktForAndelISøknadsperiode } from './FrisinnUtils';

const lagBgPeriode = (beregningsgrunnlagPeriodeFom, beregningsgrunnlagPeriodeTom) => {
  return {
    beregningsgrunnlagPeriodeFom,
    beregningsgrunnlagPeriodeTom,
  };
};

const lagFrisinnAndel = (status, beløp) => {
  return {
    oppgittInntekt: beløp,
    statusSøktFor: {
      kode: status,
    },
  };
};

const lagFrisinnPeriode = (fom, tom, frisinnAndeler) => {
  return {
    fom,
    tom,
    frisinnAndeler,
  };
};

const lagFrisinngrunnlag = frisinnPerioder => {
  return {
    frisinnPerioder,
  };
};

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
});
