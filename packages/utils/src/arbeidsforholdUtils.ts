import { ArbeidsforholdV2, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

const getEndCharFromId = (id: string) => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const utledArbeidsforholdNavn = (
  arbeidsforhold: ArbeidsforholdV2,
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId,
) => {
  if (!arbeidsforhold || !arbeidsforhold.arbeidsgiver || !arbeidsforhold.arbeidsgiver.arbeidsgiverOrgnr) return '';

  const orgnr = arbeidsforhold.arbeidsgiver.arbeidsgiverOrgnr;

  const arbeidsgiverOpplysninger = arbeidsgiverOpplysningerPerId ? arbeidsgiverOpplysningerPerId[orgnr] : null;

  return arbeidsforhold.arbeidsforhold?.eksternArbeidsforholdId
    ? `${arbeidsgiverOpplysninger?.navn} (${orgnr})${getEndCharFromId(
        arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId,
      )}`
    : `${arbeidsgiverOpplysninger?.navn} (${orgnr})`;
};

export const arbeidsforholdHarAksjonspunktÅrsak = (arbeidsforhold: ArbeidsforholdV2): boolean =>
  Array.isArray(arbeidsforhold.aksjonspunktÅrsaker) && arbeidsforhold.aksjonspunktÅrsaker.length > 0;
