import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { sak_kontrakt_beregningsresultat_BeregningsresultatPeriodeAndelDto as BeregningsresultatPeriodeAndelDto } from '@navikt/k9-sak-typescript-client';
import { NyPeriodeFormAndeler } from './manuellePerioder/FormState';

export const getAktivitet = (
  aktivitetStatus: BeregningsresultatPeriodeAndelDto['aktivitetStatus'],
  kodeverkNavnFraKode,
) =>
  // hvis valgtAndel ikke satt ennå return tom string.
  aktivitetStatus === undefined ? '' : kodeverkNavnFraKode(aktivitetStatus, KodeverkType.AKTIVITET_STATUS);

export const getInntektskategori = (
  inntektkategori: NyPeriodeFormAndeler['inntektskategori'],
  kodeverkNavnFraKode,
): string =>
  // hvis valgtAndel ikke satt ennå return tom string.
  inntektkategori === undefined ? '' : kodeverkNavnFraKode(inntektkategori, KodeverkType.INNTEKTSKATEGORI);

const getEndCharFromId = (id: string) => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const createArbeidsgiverVisningsnavnForAndel = (andel, kodeverkNavnFraKode, arbeidsgiverOpplysningerPerId) => {
  if (!andel) return '';

  let identifikator;
  if (andel.arbeidsgiverOrgnr) {
    identifikator = andel.arbeidsgiverOrgnr;
  } else if (andel.arbeidsgiver?.arbeidsgiverOrgnr) {
    identifikator = andel.arbeidsgiver.arbeidsgiverOrgnr;
  }

  if (!identifikator) {
    return andel.aktivitetStatus ? kodeverkNavnFraKode(andel.aktivitetStatus, KodeverkType.AKTIVITET_STATUS) : '';
  }

  const navn =
    arbeidsgiverOpplysningerPerId && arbeidsgiverOpplysningerPerId[identifikator]
      ? arbeidsgiverOpplysningerPerId[identifikator].navn
      : '';

  if (!navn) {
    return `${identifikator}${getEndCharFromId(andel.eksternArbeidsforholdId)}`;
  }

  return `${navn} (${identifikator})${getEndCharFromId(andel.eksternArbeidsforholdId)}`;
};

export const createPrivatarbeidsgiverVisningsnavnForAndel = (
  andel,
  getKodeverknavn,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
) => {
  if (!andel) return '';

  let identifikator;
  if (andel.arbeidsgiverPersonIdent) {
    identifikator = andel.arbeidsgiverPersonIdent;
  } else if (andel.arbeidsgiver?.arbeidsgiverPersonIdent) {
    identifikator = andel.arbeidsgiver.arbeidsgiverPersonIdent;
  }

  if (identifikator == null) {
    return '';
  }

  const arbeidsgiverOpplysninger = Object.values(arbeidsgiverOpplysningerPerId).find(
    v => v?.personIdentifikator === identifikator,
  );

  const navn = arbeidsgiverOpplysninger != null ? arbeidsgiverOpplysninger?.navn : '';

  if (!navn) {
    return `${identifikator}${getEndCharFromId(andel.eksternArbeidsforholdId)}`;
  }

  return `${navn} (${identifikator})${getEndCharFromId(andel.eksternArbeidsforholdId)}`;
};
