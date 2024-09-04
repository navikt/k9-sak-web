import {ArbeidsgiverOpplysninger, ArbeidsgiverOpplysningerPerId} from "@k9-sak-web/types";

export const getAktivitet = (aktivitetStatus, getKodeverknavn) =>
  // hvis valgtAndel ikke satt ennå return tom string.
  aktivitetStatus === undefined ? '' : getKodeverknavn(aktivitetStatus);

export const getInntektskategori = (inntektkategori, getKodeverknavn) =>
  // hvis valgtAndel ikke satt ennå return tom string.
  inntektkategori === undefined ? '' : getKodeverknavn(inntektkategori);

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const createArbeidsgiverVisningsnavnForAndel = (andel, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
  if (!andel) return '';

  let identifikator;
  if (andel.arbeidsgiverOrgnr) {
    identifikator = andel.arbeidsgiverOrgnr;
  } else if (andel.arbeidsgiver?.arbeidsgiverOrgnr) {
    identifikator = andel.arbeidsgiver.arbeidsgiverOrgnr;
  }

  if (!identifikator) {
    return andel.aktivitetStatus ? getKodeverknavn(andel.aktivitetStatus) : '';
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

export const createPrivatarbeidsgiverVisningsnavnForAndel = (andel, getKodeverknavn, arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId) => {
  if (!andel) return '';

  let identifikator;
  if (andel.arbeidsgiverPersonIdent) {
    identifikator = andel.arbeidsgiverPersonIdent;
  } else if (andel.arbeidsgiver?.arbeidsgiverPersonIdent) {
    identifikator = andel.arbeidsgiver.arbeidsgiverPersonIdent;
  }

  if(identifikator == null) {
    return ''
  }

  const arbeidsgiverOpplysninger = Object.values(arbeidsgiverOpplysningerPerId).find(v => v?.personIdentifikator == identifikator)

  const navn = arbeidsgiverOpplysninger != null
      ? arbeidsgiverOpplysninger?.navn
      : '';

  if (!navn) {
    return `${identifikator}${getEndCharFromId(andel.eksternArbeidsforholdId)}`;
  }

  return `${navn} (${identifikator})${getEndCharFromId(andel.eksternArbeidsforholdId)}`;
};
