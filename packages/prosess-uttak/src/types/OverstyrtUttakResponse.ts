import { OverstyringUttak } from './OverstyringUttak';

export interface OverstyrtUttakResponse {
  overstyringer: OverstyringUttak[];
  arbeidsgiverOversikt: {
    arbeidsgivere: {
      [key: string]: {
        identifikator: string;
        personIdentifikator: string;
        navn: string;
        fødselsdato: string;
        arbeidsforholdreferanser: {
          internArbeidsforholdId: string;
          eksternArbeidsforholdId: string;
        }[];
      };
    };
  };
}
