import { Arbeidsforhold } from '@k9-sak-web/types';

type CustomArbeidsforhold = Arbeidsforhold & {
  replaceOptions?: Arbeidsforhold[];
  originalFomDato?: string;
  overstyrtTom?: string;
  navn?: string;
  arbeidsforholdHandlingField?: string;
  aktivtArbeidsforholdHandlingField?: string;
};

export default CustomArbeidsforhold;
