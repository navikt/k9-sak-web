import { Arbeidsforhold, ArbeidsforholdReferanse } from '.';

export interface OverstyrbareAktiviteterResponse {
  arbeidsforholdsperioder: Arbeidsforhold[];
  arbeidsgiverOversikt: { [key: string]: ArbeidsforholdReferanse };
}
