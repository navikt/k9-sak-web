const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

const createVisningsnavnForAktivitet = (aktivitet, getKodeverknavn, arbeidsgiverOpplysningerPerId) => {
  const arbeidsgiverNavn =
    arbeidsgiverOpplysningerPerId && arbeidsgiverOpplysningerPerId[aktivitet.arbeidsgiverIdent]
      ? arbeidsgiverOpplysningerPerId[aktivitet.arbeidsgiverIdent].navn
      : '';

  if (!arbeidsgiverNavn) {
    return aktivitet.arbeidsforholdType ? getKodeverknavn(aktivitet.arbeidsforholdType) : '';
  }

  return `${arbeidsgiverNavn} (${aktivitet.arbeidsgiverIdent})${getEndCharFromId(aktivitet.eksternArbeidsforholdId)}`;
};

export default createVisningsnavnForAktivitet;