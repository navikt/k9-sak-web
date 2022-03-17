import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

const erAndelUtenReferanseOgGrunnlagHarAndelForSammeArbeidsgiverMedReferanse = (andel, beregningsgrunnlag) => {
  if (andel.arbeidsforholdId === null) {
    const antallAndelerISammeVirksomhetMedReferanse = beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregningsgrunnlagPrStatusOgAndel
      .filter((a) => a.aktivitetStatus === aktivitetStatus.ARBEIDSTAKER)
      .filter((a) => a.arbeidsforhold && a.arbeidsforhold.arbeidsgiverIdent === andel.arbeidsgiverIdent)
      .filter((a) => a.arbeidsforhold && a.arbeidsforhold.arbeidsforholdId != null)
      .length;
    return antallAndelerISammeVirksomhetMedReferanse > 0;
  }
  return false;
};

export default erAndelUtenReferanseOgGrunnlagHarAndelForSammeArbeidsgiverMedReferanse;
