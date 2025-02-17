import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { AktivitetStatus } from '@navikt/ft-kodeverk';

import { calcDays } from '@navikt/ft-utils';

import type { ArbeidsgiverOpplysninger, ArbeidsgiverOpplysningerPerId } from '../../types/ArbeidsgiverOpplysninger';
import type { Beregningsgrunnlag, ForlengelsePeriodeProp } from '../../types/Beregningsgrunnlag';
import type { Inntektsforhold, VurderInntektsforholdPeriode } from '../../types/BeregningsgrunnlagFordeling';
import { type TilkommetInntektsforholdFieldValues } from '../../types/FordelBeregningsgrunnlagPanelValues';
import { erPeriodeTilVurdering } from '../util/ForlengelseUtils';
import { createVisningsnavnForAktivitetFordeling } from '../util/visningsnavnHelper';

dayjs.extend(isBetween);
const DATO_PRAKSISENDRING_TILKOMMET_INNTEKT = '2023-05-01';

function unike() {
  return (v: Inntektsforhold, i: number, l: Inntektsforhold[]) =>
    l.findIndex(
      it =>
        it.skalRedusereUtbetaling === v.skalRedusereUtbetaling &&
        it.arbeidsforholdId === v.arbeidsforholdId &&
        it.arbeidsgiverId === v.arbeidsgiverId &&
        it.aktivitetStatus === v.aktivitetStatus &&
        it.bruttoInntektPrÅr === v.bruttoInntektPrÅr,
    ) === i;
}

const oppdaterTomOgInntektsforholdForSistePeriode = (
  liste: VurderInntektsforholdPeriode[],
  periode: VurderInntektsforholdPeriode,
) => {
  const forrigePeriode = liste.pop();
  if (!forrigePeriode) {
    return;
  }
  const inntektsforholdListe = forrigePeriode.inntektsforholdListe ? [...forrigePeriode.inntektsforholdListe] : [];
  periode.inntektsforholdListe.forEach(it => inntektsforholdListe.push(it));
  const endretPeriode = {
    ...forrigePeriode,
    inntektsforholdListe: inntektsforholdListe.filter(unike()),
    tom: periode.tom,
  };
  liste.push(endretPeriode);
};

const harIngenRelevantEndring = (
  inntektsforholdPeriode: VurderInntektsforholdPeriode,
  forrigeInntektsforholdPeriode?: VurderInntektsforholdPeriode,
) => {
  const inntektsforholdListe = inntektsforholdPeriode.inntektsforholdListe || [];
  const forrigeInntektsforholdListe = forrigeInntektsforholdPeriode?.inntektsforholdListe || [];

  for (let i = 0; i < inntektsforholdListe.length; i += 1) {
    const inntektsforholdIPeriode = inntektsforholdListe[i];
    const inntektsforholdFraForrige = forrigeInntektsforholdListe.find(
      a =>
        a.aktivitetStatus === inntektsforholdIPeriode?.aktivitetStatus &&
        a.arbeidsgiverId === inntektsforholdIPeriode.arbeidsgiverId &&
        a.arbeidsforholdId === inntektsforholdIPeriode.arbeidsforholdId,
    );
    if (inntektsforholdFraForrige === undefined) {
      return true;
    }
    if (inntektsforholdFraForrige.bruttoInntektPrÅr !== inntektsforholdIPeriode?.bruttoInntektPrÅr) {
      return false;
    }
    if (inntektsforholdFraForrige.skalRedusereUtbetaling !== inntektsforholdIPeriode?.skalRedusereUtbetaling) {
      return false;
    }
  }
  return true;
};

const periodeInneholderVirkedager = (dag1: string, dag2: string): boolean => calcDays(dag1, dag2, true) > 2;

const erVirkedagMellomPeriodene = (
  inntektsforholdPeriode: VurderInntektsforholdPeriode,
  forrigeInntektsforholdPeriode: VurderInntektsforholdPeriode,
): boolean => {
  const periode1Slutt = forrigeInntektsforholdPeriode.tom;
  const periode2Start = inntektsforholdPeriode.fom;
  return dayjs(periode1Slutt).isBefore(dayjs(periode2Start))
    ? periodeInneholderVirkedager(periode1Slutt, periode2Start)
    : periodeInneholderVirkedager(periode2Start, periode1Slutt);
};

const harPeriodeSomKanKombineresMedForrige = (
  inntektsforholdPeriode: VurderInntektsforholdPeriode,
  periodeList: VurderInntektsforholdPeriode[],
  forlengelseperioder?: ForlengelsePeriodeProp[],
): boolean => {
  // Spesialbehandler 1. mai 2023 da alle saker før denne datoen ble behandlet etter andre retningslinjer
  if (dayjs(inntektsforholdPeriode.fom).isSame(dayjs(DATO_PRAKSISENDRING_TILKOMMET_INNTEKT))) {
    return false;
  }
  const forrigeInntektsforholdPeriode = periodeList[periodeList.length - 1];
  const dennePeriodenErTilVurdering = erPeriodeTilVurdering(inntektsforholdPeriode, forlengelseperioder);
  if (dennePeriodenErTilVurdering && !erPeriodeTilVurdering(forrigeInntektsforholdPeriode, forlengelseperioder)) {
    return false;
  }
  if (
    dennePeriodenErTilVurdering &&
    forrigeInntektsforholdPeriode &&
    erVirkedagMellomPeriodene(inntektsforholdPeriode, forrigeInntektsforholdPeriode)
  ) {
    return false;
  }
  return harIngenRelevantEndring(inntektsforholdPeriode, forrigeInntektsforholdPeriode);
};

const sjekkOmPeriodeSkalLeggesTil =
  (forlengelseperioder?: ForlengelsePeriodeProp[]) =>
  (
    aggregatedPeriodList: VurderInntektsforholdPeriode[],
    periode: VurderInntektsforholdPeriode,
  ): VurderInntektsforholdPeriode[] => {
    if (aggregatedPeriodList.length === 0) {
      aggregatedPeriodList.push({ ...periode });
      return aggregatedPeriodList;
    }
    if (harPeriodeSomKanKombineresMedForrige(periode, aggregatedPeriodList, forlengelseperioder)) {
      oppdaterTomOgInntektsforholdForSistePeriode(aggregatedPeriodList, periode);
      return aggregatedPeriodList;
    }
    aggregatedPeriodList.push({ ...periode });
    return aggregatedPeriodList;
  };

export const slaaSammenPerioder = (
  perioder: VurderInntektsforholdPeriode[],
  forlengelseperioder?: ForlengelsePeriodeProp[],
): VurderInntektsforholdPeriode[] => perioder.reduce(sjekkOmPeriodeSkalLeggesTil(forlengelseperioder), []);

export function erVurdertTidligere(
  periode: VurderInntektsforholdPeriode,
  beregningsgrunnlag: Beregningsgrunnlag,
): boolean {
  return (
    !erPeriodeTilVurdering(periode, beregningsgrunnlag.forlengelseperioder) &&
    !!periode.inntektsforholdListe &&
    periode.inntektsforholdListe?.every(a => a.skalRedusereUtbetaling !== null)
  );
}

export const getAktivitetNavnFraInnteksforhold = (
  inntektsforhold: Inntektsforhold,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
) => {
  let agOpplysning: ArbeidsgiverOpplysninger | undefined = undefined;
  if (inntektsforhold.arbeidsgiverId !== null && inntektsforhold.arbeidsgiverId !== undefined) {
    agOpplysning = arbeidsgiverOpplysningerPerId[inntektsforhold.arbeidsgiverId];
  }

  if (inntektsforhold.aktivitetStatus === AktivitetStatus.ARBEIDSTAKER) {
    if (!agOpplysning) {
      return 'Arbeidsforhold';
    }
    return createVisningsnavnForAktivitetFordeling(agOpplysning, inntektsforhold.arbeidsforholdId);
  }

  if (inntektsforhold.aktivitetStatus === AktivitetStatus.FRILANSER) {
    return 'Frilanser';
  }

  if (inntektsforhold.aktivitetStatus === AktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE) {
    return 'Selvstendig næringsdrivende';
  }

  if (inntektsforhold.aktivitetStatus === AktivitetStatus.DAGPENGER) {
    return 'Dagpenger';
  }

  return '';
};

export const getAktivitetNavnFraField = (
  field: TilkommetInntektsforholdFieldValues,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
) => {
  let agOpplysning: ArbeidsgiverOpplysninger | undefined = undefined;
  if (field.arbeidsgiverIdent) {
    agOpplysning = arbeidsgiverOpplysningerPerId[field.arbeidsgiverIdent];
  }

  if (field.aktivitetStatus === AktivitetStatus.ARBEIDSTAKER) {
    if (!agOpplysning) {
      return 'Arbeidsforhold';
    }
    return createVisningsnavnForAktivitetFordeling(agOpplysning, field.arbeidsforholdId);
  }

  if (field.aktivitetStatus === AktivitetStatus.FRILANSER) {
    return 'Frilanser';
  }

  if (field.aktivitetStatus === AktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE) {
    return 'Selvstendig næringsdrivende';
  }
  return '';
};
