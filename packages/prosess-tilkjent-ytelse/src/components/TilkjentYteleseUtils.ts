import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';

export const getAktivitet = (aktivitetStatus, kodeverkNavnFraKode) =>
  // hvis valgtAndel ikke satt ennå return tom string.
  aktivitetStatus === undefined ? '' : kodeverkNavnFraKode(aktivitetStatus, KodeverkType.AKTIVITET_STATUS);

export const getInntektskategori = (inntektkategori, kodeverkNavnFraKode) =>
  // hvis valgtAndel ikke satt ennå return tom string.
  inntektkategori === undefined ? '' : kodeverkNavnFraKode(inntektkategori, KodeverkType.INNTEKTSKATEGORI);

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const createVisningsnavnForAndel = (andel, kodeverkNavnFraKode, arbeidsgiverOpplysningerPerId) => {
  if (!andel) return '';

  let identifikator;
  if (andel.arbeidsgiverOrgnr) {
    identifikator = andel.arbeidsgiverOrgnr;
  } else if (andel.arbeidsgiver?.arbeidsgiverOrgnr) {
    identifikator = andel.arbeidsgiver.arbeidsgiverOrgnr;
  } else if (andel.arbeidsgiver?.identifikator) {
    identifikator = andel.arbeidsgiver.identifikator;
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

export default createVisningsnavnForAndel;
