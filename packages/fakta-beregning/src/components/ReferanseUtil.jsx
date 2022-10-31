export const getEndCharFromId = (id, substringLength = 4) =>
  id ? `...${id.substring(id.length - substringLength, id.length)}` : '';

export const finnEksternIdSubstring = (arbeidsgiverIdent, internId, arbeidsgiverOpplysningerPerId) => {
  if (internId === null || internId === undefined || internId === '') {
    return '';
  }

  const opplysningerForArbeidsgiver = arbeidsgiverOpplysningerPerId[arbeidsgiverIdent];

  if (!opplysningerForArbeidsgiver) {
    return '';
  }

  const { arbeidsforholdreferanser } = opplysningerForArbeidsgiver;
  const referanseForInternId = arbeidsforholdreferanser.find(
    referanse => referanse.internArbeidsforholdId === internId,
  );

  if (referanseForInternId === undefined) {
    return '';
  }

  const eksternId = referanseForInternId.eksternArbeidsforholdId;
  let sisteSiffer = getEndCharFromId(eksternId);
  let referanserMedLikeSisteSiffer = arbeidsforholdreferanser.filter(
    ({ eksternArbeidsforholdId }) => getEndCharFromId(eksternArbeidsforholdId) === sisteSiffer,
  );
  let i = 4;
  while (referanserMedLikeSisteSiffer.length > 1) {
    i += 1;
    sisteSiffer = getEndCharFromId(eksternId, i);
    referanserMedLikeSisteSiffer = arbeidsforholdreferanser.filter(
      // eslint-disable-next-line no-loop-func
      ({ eksternArbeidsforholdId }) =>
        eksternArbeidsforholdId.length >= i && getEndCharFromId(eksternArbeidsforholdId, i) === sisteSiffer,
    );
  }
  return sisteSiffer;
};
