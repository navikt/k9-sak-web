import { Arbeidsforhold } from '@k9-sak-web/types';
import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const utledArbeidsforholdNavn = (arbeidsforhold: Arbeidsforhold) => {
  if (arbeidsforhold.lagtTilAvSaksbehandler) {
    return arbeidsforhold.navn;
  }

  return arbeidsforhold.arbeidsforholdId
    ? `${arbeidsforhold.navn} (${arbeidsforhold.arbeidsgiverIdentifiktorGUI})${getEndCharFromId(
        arbeidsforhold.eksternArbeidsforholdId,
      )}`
    : `${arbeidsforhold.navn} (${arbeidsforhold.arbeidsgiverIdentifiktorGUI})`;
};

export const utledArbeidsforholdYrkestittel = (arbeidsforhold: ArbeidsforholdV2) => {
  return arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId
    ? `${arbeidsforhold.yrkestittel} (${getEndCharFromId(arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId)})`
    : `${arbeidsforhold.yrkestittel}`;
};
