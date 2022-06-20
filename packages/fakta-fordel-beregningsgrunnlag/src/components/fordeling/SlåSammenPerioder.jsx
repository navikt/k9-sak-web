/* eslint-disable */
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';


const skalSlåSammenAvsluttetArbeidsforholdPerioder = (periode, bgPerioder) => {
  const periodeIndex = bgPerioder.indexOf(periode);
  const forrigePeriode = bgPerioder[periodeIndex - 1];
  return forrigePeriode.bruttoPrAar === periode.bruttoPrAar;
}

const erArbeidsforholdLike = (andel1, andel2) => {
  if (!andel1.arbeidsforhold && !andel2.arbeidsforhold) {
    return true;
  }
  if (!!andel1.arbeidsforhold && !!andel2.arbeidsforhold) {
    return andel1.arbeidsforhold.arbeidsgiverIdent === andel2.arbeidsforhold.arbeidsgiverIdent &&
      andel1.arbeidsforhold.arbeidsforholdId === andel2.arbeidsforhold.arbeidsforholdId;
  }
  return false;
}

const harIngenRelevantEndringForFordeling = (fordelPeriode, forrigeEndringPeriode, periode, bgPerioder) => {
  if (fordelPeriode.fordelBeregningsgrunnlagAndeler.length !== forrigeEndringPeriode.fordelBeregningsgrunnlagAndeler.length) {
    return false;
  }
  const periodeIndex = bgPerioder.indexOf(periode);
  const forrigePeriode = bgPerioder[periodeIndex - 1];
  if (periode.bruttoPrAar !== forrigePeriode.bruttoPrAar) {
    return false;
  }
  for (let i = 0; i < fordelPeriode.fordelBeregningsgrunnlagAndeler.length; i += 1) {
    const andelIPeriode = fordelPeriode.fordelBeregningsgrunnlagAndeler[i];
    const andelFraForrige = forrigeEndringPeriode.fordelBeregningsgrunnlagAndeler.find(a =>
      a.aktivitetStatus === andelIPeriode.aktivitetStatus &&
      a.inntektskategori === andelIPeriode.inntektskategori &&
      erArbeidsforholdLike(a, andelIPeriode));
    if (andelFraForrige === undefined) {
      return false;
    }
    if (andelFraForrige.refusjonskravPrAar !== andelIPeriode.refusjonskravPrAar) {
      return false
    }
  }
  return true;
}

const harPeriodeÅrsak = (periode, periodeÅrsak) => periode.periodeAarsaker.map(({ kode }) => kode).includes(periodeÅrsak);

const harPeriodeårsakerSomIkkeSlåsSammen = (periode) =>
  harPeriodeÅrsak(periode, periodeAarsak.ENDRING_I_REFUSJONSKRAV) ||
  harPeriodeÅrsak(periode, periodeAarsak.REFUSJON_OPPHOERER);

const harPeriodeSomKanKombineresMedForrige = (periode, bgPerioder, fordelPeriode, periodeList) => {
  const forrigeEndringPeriode = periodeList[periodeList.length - 1];
  if (
    fordelPeriode.harPeriodeAarsakGraderingEllerRefusjon !==
    forrigeEndringPeriode.harPeriodeAarsakGraderingEllerRefusjon
  ) {
    return false;
  }
  if (fordelPeriode.skalRedigereInntekt !== forrigeEndringPeriode.skalRedigereInntekt) {
    return false;
  }
  if (harPeriodeårsakerSomIkkeSlåsSammen(periode)) {
    return false;
  }
  if (harPeriodeÅrsak(periode, periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET)) {
    return skalSlåSammenAvsluttetArbeidsforholdPerioder(periode, bgPerioder);
  }
  if (harPeriodeÅrsak(periode, periodeAarsak.ENDRING_I_AKTIVITETER_SØKT_FOR)) {
    return harIngenRelevantEndringForFordeling(fordelPeriode, forrigeEndringPeriode, periode, bgPerioder);
  }
  return true;
};

const oppdaterTomDatoForSistePeriode = (liste, periode) => {
  const forrigePeriode = liste.pop();
  forrigePeriode.tom = periode.tom;
  liste.push(forrigePeriode);
};

const sjekkOmPeriodeSkalLeggesTil = bgPerioder => (aggregatedPeriodList, periode) => {
  if (aggregatedPeriodList.length === 0) {
    aggregatedPeriodList.push({ ...periode });
    return aggregatedPeriodList;
  }
  const matchendeBgPeriode = bgPerioder.find(p => p.beregningsgrunnlagPeriodeFom === periode.fom);
  if (matchendeBgPeriode) {
    if (harPeriodeSomKanKombineresMedForrige(matchendeBgPeriode, bgPerioder, periode, aggregatedPeriodList)) {
      oppdaterTomDatoForSistePeriode(aggregatedPeriodList, periode);
      return aggregatedPeriodList;
    }
    aggregatedPeriodList.push({ ...periode });
  }
  return aggregatedPeriodList;
};

const slåSammenPerioder = (perioder, bgPerioder) =>
  perioder.reduce(sjekkOmPeriodeSkalLeggesTil(bgPerioder), []);

export default slåSammenPerioder;
