import { Arbeidsforhold } from '@k9-sak-web/types';

const getEndCharFromId = id => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

const utledArbeidsforholdNavn = (arbeidsforhold: Arbeidsforhold) => {
  return arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId
    ? `${arbeidsforhold.yrkestittel} (${getEndCharFromId(arbeidsforhold.arbeidsforhold.eksternArbeidsforholdId)})`
    : `${arbeidsforhold.yrkestittel}`;
};

export default utledArbeidsforholdNavn;
