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

const erMars2020 = dato => {
  return dato.month() === 2 && dato.year() === 2020;
};

const erSøktForMars2020 = frisinnPeriode => {
  const tom = moment(frisinnPeriode.tom);
  return erMars2020(tom);
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

  // Søkader for mars må spesialhåndteres da disse er de eneste som krysser måneder
  if (erMars2020(bgFom) && frisinnPerioder.some(p => erSøktForMars2020(p))) {
    const aprilSlutt = moment('2020-04-30');
    const periodeVedSisteDagIApril = frisinnPerioder.find(p => moment(p.tom).isSame(aprilSlutt, 'day'));
    if (!periodeVedSisteDagIApril) {
      return null;
    }
    return periodeVedSisteDagIApril.frisinnAndeler.filter(andel => andel.statusSøktFor.kode === status);
  }
  const sisteDatoIMåned = moment(bgPeriode.beregningsgrunnlagPeriodeTom).endOf('month');
  const periodeVedSisteDagIMnd = frisinnPerioder.find(
    p => !moment(p.fom).isBefore(bgFom) && moment(p.tom).isSame(sisteDatoIMåned, 'day'),
  );
  if (!periodeVedSisteDagIMnd) {
    return null;
  }
  return periodeVedSisteDagIMnd.frisinnAndeler.filter(andel => andel.statusSøktFor.kode === status);
};

export const erSøktForAndelISøknadsperiode = (status, bgPeriode, ytelsegrunnlag) => {
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
