export const getAktivitet = (aktivitetStatus, getKodeverknavn) =>
  // hvis valgtAndel ikke satt ennå return tom string.
  aktivitetStatus === undefined ? '' : getKodeverknavn(aktivitetStatus);

export const getInntektskategori = (inntektkategori, getKodeverknavn) =>
  // hvis valgtAndel ikke satt ennå return tom string.
  inntektkategori === undefined ? '' : getKodeverknavn(inntektkategori);

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const createVisningsnavnForAndel = (andel, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
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

export default createVisningsnavnForAndel;
