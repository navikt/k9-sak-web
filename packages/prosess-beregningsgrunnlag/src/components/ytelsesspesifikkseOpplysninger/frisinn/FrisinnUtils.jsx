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

const finnFrisinnAndelerIPeriodeForStatus = (status, bgPeriode, ytelsegrunnlag) => {
  const { frisinnPerioder } = ytelsegrunnlag;
  if (!frisinnPerioder) {
    return null;
  }
  const fom = bgPeriode.beregningsgrunnlagPeriodeFom;
  const tom = bgPeriode.beregningsgrunnlagPeriodeTom;
  const matchetPeriode = frisinnPerioder.find(p => p.fom === fom && p.tom === tom);
  if (!matchetPeriode) {
    return null;
  }
  return matchetPeriode.frisinnAndeler.filter(andel => andel.statusSøktFor.kode === status);
};

export const erSøktForAndelIPeriode = (status, bgPeriode, ytelsegrunnlag) => {
  const andeler = finnFrisinnAndelerIPeriodeForStatus(status, bgPeriode, ytelsegrunnlag);
  return !!andeler && andeler.length > 0;
};

export const erSøktForAndel = (status, ytelsegrunnlag) => {
  const { frisinnPerioder } = ytelsegrunnlag;
  if (!frisinnPerioder) {
    return null;
  }
  const periodeDerStatusErSøktFor = frisinnPerioder.find(
    periode => !!periode.frisinnAndeler.find(andel => andel.statusSøktFor.kode === status),
  );
  return !!periodeDerStatusErSøktFor;
};

export const finnVisningForStatus = (bg, status) => {
  const erSøktForStatus = erSøktForAndel(status, bg.ytelsesspesifiktGrunnlag);
  if (erSøktForStatus) {
    // Er det søkt ytelse for statusen kan vi finne den inntekten som ligger i første periode
    const førstePeriode = bg.beregningsgrunnlagPeriode[0];
    return finnSamletBruttoForStatus(førstePeriode.beregningsgrunnlagPrStatusOgAndel, status);
  }
  // Er det ikke søkt ytelse må vi ta den inntekten som ligger i perioden det er søkt om
  const periodeFom = perioderSøktFor[0].fom;
  const periodeTom = perioderSøktFor[0].tom;
  const matchendePeriode = bg.beregningsgrunnlagPeriode.find(
    p => p.beregningsgrunnlagPeriodeFom === periodeFom && p.beregningsgrunnlagPeriodeTom === periodeTom,
  );
  return matchendePeriode ? finnSamletBruttoForStatus(matchendePeriode.beregningsgrunnlagPrStatusOgAndel, status) : 0;
};

export const finnVisningForStatusIPeriode = (status, bg, bgPeriode) => {
  const erSøktForStatus = erSøktForAndel(status, bg.ytelsesspesifiktGrunnlag);
  if (erSøktForStatus) {
    // Er det søkt ytelse for statusen kan vi finne den inntekten som ligger i første periode
    const førstePeriode = bg.beregningsgrunnlagPeriode[0];
    return finnSamletBruttoForStatus(førstePeriode.beregningsgrunnlagPrStatusOgAndel, status);
  }
  // Er det ikke søkt ytelse må vi ta den inntekten som ligger i perioden det er søkt om
  return finnSamletBruttoForStatus(bgPeriode.beregningsgrunnlagPrStatusOgAndel, status);
};

export const finnOppgittInntektForAndelIPeriode = (status, bgPeriode, ytelsegrunnlag) => {
  const matchendeAndeler = finnFrisinnAndelerIPeriodeForStatus(status, bgPeriode, ytelsegrunnlag);
  if (!matchendeAndeler || matchendeAndeler.length < 1) {
    return 0;
  }
  const inntekt = matchendeAndeler.map(({ oppgittInntekt }) => oppgittInntekt).reduce((sum, brutto) => sum + brutto, 0);
  if (!inntekt || inntekt === 0) {
    return 0;
  }
  return inntekt;
};

export const finnOppgittArbeidsinntektIPeriode = (bgPeriode, ytelsegrunnlag) => {
  const { frisinnPerioder } = ytelsegrunnlag;
  if (!frisinnPerioder) {
    return 0;
  }
  const fom = bgPeriode.beregningsgrunnlagPeriodeFom;
  const tom = bgPeriode.beregningsgrunnlagPeriodeTom;
  const matchetPeriode = frisinnPerioder.find(p => p.fom === fom && p.tom === tom);
  return matchetPeriode ? matchetPeriode.oppgittArbeidsinntekt : null;
};
