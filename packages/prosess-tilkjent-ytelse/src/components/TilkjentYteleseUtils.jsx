export const getAktivitet = (aktivitetStatus, getKodeverknavn) => {
  // hvis valgtAndel ikke satt ennå return tom string.
  return aktivitetStatus === undefined ? '' : getKodeverknavn(aktivitetStatus);
};

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const createVisningsnavnForAndel = (andel, getKodeverknavn) => {
  if (!andel.arbeidsgiverNavn) {
    return andel.aktivitetStatus ? getKodeverknavn(andel.aktivitetStatus) : '';
  }
  return andel.arbeidsforholdId
    ? `${andel.arbeidsgiverNavn} (${andel.arbeidsgiverOrgnr})${getEndCharFromId(andel.eksternArbeidsforholdId)}`
    : `${andel.arbeidsgiverNavn} (${andel.arbeidsgiverOrgnr})`;
};

export default createVisningsnavnForAndel;
