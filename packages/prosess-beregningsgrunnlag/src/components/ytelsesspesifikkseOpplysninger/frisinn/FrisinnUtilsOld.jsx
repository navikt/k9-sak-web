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

const finnVisningForStatus = (bg, status) => {
  const { perioderSøktFor } = bg.ytelsesspesifiktGrunnlag;
  const erSøktForStatus = perioderSøktFor.some(p => p.statusSøktFor.kode === status);
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

export default finnVisningForStatus;
