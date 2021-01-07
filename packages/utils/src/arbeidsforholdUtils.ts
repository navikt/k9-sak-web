import { Arbeidsforhold, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const utledArbeidsforholdNavn = (
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

export const utledArbeidsforholdYrkestittel = (arbeidsforhold: ArbeidsforholdV2) => {
  return arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId
    ? `${arbeidsforhold.yrkestittel} (${getEndCharFromId(arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId)})`
    : `${arbeidsforhold.yrkestittel}`;
};
