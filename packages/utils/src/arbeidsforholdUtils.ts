import { Arbeidsforhold } from '@k9-sak-web/types';

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

const utledArbeidsforholdNavn = (arbeidsforhold: Arbeidsforhold) => {
  if (arbeidsforhold.lagtTilAvSaksbehandler) {
    return arbeidsforhold.navn;
  }

  return arbeidsforhold.arbeidsforholdId
    ? `${arbeidsforhold.navn} (${arbeidsforhold.arbeidsgiverIdentifiktorGUI})${getEndCharFromId(
        arbeidsforhold.eksternArbeidsforholdId,
      )}`
    : `${arbeidsforhold.navn} (${arbeidsforhold.arbeidsgiverIdentifiktorGUI})`;
};

export default utledArbeidsforholdNavn;
