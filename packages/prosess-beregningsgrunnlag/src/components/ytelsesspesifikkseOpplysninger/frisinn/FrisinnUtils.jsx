import moment from 'moment';

const finnSamletBruttoForStatus = (andeler, status) => {
  if (!andeler) {
    return 0;
  }
  const inntekt = andeler
    .filter(a => a.aktivitetStatus.kode === status)
    .map(({ bruttoPrAar }) => bruttoPrAar)
    .reduce((sum, brutto) => sum + brutto, 0);
  if (!inntekt || inntekt === 0) {
    return 0;
  }
  return inntekt;
};

/**
 Denne metoden sjekker om det er søkt for valgt status i denne beregningsperiode eller i neste dersom den inngår i samme søknadsperiode.
 Hvis to perioder ligger i samme måned ligger de i samme søknadsperiode
 */
const finnFrisinnAndelerISøknadsperiodeForStatus = (status, bgPeriode, ytelsegrunnlag) => {
  const { frisinnPerioder } = ytelsegrunnlag;
  if (!frisinnPerioder) {
    return null;
  }
  const bgFom = moment(bgPeriode.beregningsgrunnlagPeriodeFom);
  const sisteDatoIMåned = moment(bgPeriode.beregningsgrunnlagPeriodeTom).endOf('month');
  const matchetPeriode = frisinnPerioder.find(
    p => !moment(p.fom).isBefore(bgFom) && moment(p.tom).isSame(sisteDatoIMåned, 'day'),
  );
  if (!matchetPeriode) {
    return null;
  }
  return matchetPeriode.frisinnAndeler.filter(andel => andel.statusSøktFor.kode === status);
};

export const erSøktForAndelISøknadsperiodePeriode = (status, bgPeriode, ytelsegrunnlag) => {
  const andeler = finnFrisinnAndelerISøknadsperiodeForStatus(status, bgPeriode, ytelsegrunnlag);
  return !!andeler && andeler.length > 0;
};

const erSøktForAndelIEnPeriode = (status, ytelsegrunnlag) => {
  const { frisinnPerioder } = ytelsegrunnlag;
  if (!frisinnPerioder) {
    return null;
  }
  const periodeDerStatusErSøktFor = frisinnPerioder.find(
    periode => !!periode.frisinnAndeler.find(andel => andel.statusSøktFor.kode === status),
  );
  return !!periodeDerStatusErSøktFor;
};

export const finnVisningForStatusIPeriode = (status, bg, bgPeriode) => {
  const erSøktForStatus = erSøktForAndelIEnPeriode(status, bg.ytelsesspesifiktGrunnlag);
  if (erSøktForStatus) {
    // Er det søkt ytelse for statusen kan vi finne den inntekten som ligger i første periode
    const førstePeriode = bg.beregningsgrunnlagPeriode[0];
    return finnSamletBruttoForStatus(førstePeriode.beregningsgrunnlagPrStatusOgAndel, status);
  }
  // Er det ikke søkt ytelse må vi ta den inntekten som ligger i perioden det er søkt om
  return finnSamletBruttoForStatus(bgPeriode.beregningsgrunnlagPrStatusOgAndel, status);
};

export const finnOppgittInntektForAndelIPeriode = (status, bgPeriode, ytelsegrunnlag) => {
  const matchendeAndeler = finnFrisinnAndelerISøknadsperiodeForStatus(status, bgPeriode, ytelsegrunnlag);
  if (!matchendeAndeler || matchendeAndeler.length < 1) {
    return 0;
  }
  const inntekt = matchendeAndeler.map(({ oppgittInntekt }) => oppgittInntekt).reduce((sum, brutto) => sum + brutto, 0);
  if (!inntekt || inntekt === 0) {
    return 0;
  }
  return inntekt;
};
