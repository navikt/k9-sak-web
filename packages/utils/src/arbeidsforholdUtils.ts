import { Arbeidsforhold, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

const utledArbeidsforholdNavn = (
  arbeidsforhold: Arbeidsforhold,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
) => {
  const arbeidsgiverOpplysninger = arbeidsgiverOpplysningerPerId
    ? arbeidsgiverOpplysningerPerId[arbeidsforhold.arbeidsgiverId || arbeidsforhold.arbeidsgiverIdentifikator]
    : null;

  const navn = arbeidsforhold.navn ? arbeidsforhold.navn : arbeidsgiverOpplysninger?.navn;
  if (arbeidsforhold.lagtTilAvSaksbehandler) {
    return navn;
  }

  return arbeidsforhold.arbeidsforholdId
    ? `${navn} (${arbeidsforhold.arbeidsgiverIdentifiktorGUI})${getEndCharFromId(
        arbeidsforhold.eksternArbeidsforholdId,
      )}`
    : `${navn} (${arbeidsforhold.arbeidsgiverIdentifiktorGUI})`;
};

export default utledArbeidsforholdNavn;
