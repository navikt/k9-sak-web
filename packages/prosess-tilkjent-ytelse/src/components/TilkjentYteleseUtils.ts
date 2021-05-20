export const getAktivitet = (aktivitetStatus, getKodeverknavn) =>
  // hvis valgtAndel ikke satt ennå return tom string.
  aktivitetStatus === undefined ? '' : getKodeverknavn(aktivitetStatus);

export const getInntektskategori = (inntektkategori, getKodeverknavn) =>
  // hvis valgtAndel ikke satt ennå return tom string.
  inntektkategori === undefined ? '' : getKodeverknavn(inntektkategori);

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const createVisningsnavnForAndel = (andel, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
  if (!andel) return '';

  const arbeidsgiver = arbeidsgiverOpplysningerPerId[andel.arbeidsgiverOrgnr];
  if (arbeidsgiver) {
    return arbeidsgiver.navn;
  }

  if (!andel.arbeidsgiver || !(andel.arbeidsgiver.arbeidsgiverOrgnr || andel.arbeidsgiver.identifikator)) {
    return andel.aktivitetStatus ? getKodeverknavn(andel.aktivitetStatus) : '';
  }

  const identifikator = andel.arbeidsgiver.arbeidsgiverOrgnr || andel.arbeidsgiver.identifikator;

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
