import { Arbeidstype } from '../constants';

export interface Arbeidsforhold {
  type: Arbeidstype;
  organisasjonsnummer?: string; // Bakoverkompatibilitet, skal være orgnr egentlig
  orgnr?: string;
  aktørId?: string;
  arbeidsforholdId?: string;
}
