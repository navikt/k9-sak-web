export interface Arbeidsforhold {
  type: string;
  organisasjonsnummer?: string; // Bakoverkompatibilitet, skal være orgnr egentlig
  orgnr?: string;
  aktørId?: string;
  arbeidsforholdId?: string;
}
