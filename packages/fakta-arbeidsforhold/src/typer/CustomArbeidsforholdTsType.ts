import type { ArbeidsforholdV2 } from '@k9-sak-web/types';

type CustomArbeidsforhold = ArbeidsforholdV2 & {
  replaceOptions?: ArbeidsforholdV2[];
  originalFomDato?: string;
  overstyrtTom?: string;
  navn?: string;
  arbeidsforholdHandlingField?: string;
  aktivtArbeidsforholdHandlingField?: string;
  fomDato?: string;
  tomDato?: string;
};

export default CustomArbeidsforhold;
