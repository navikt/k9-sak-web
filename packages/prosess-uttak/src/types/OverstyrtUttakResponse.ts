import { ArbeidsforholdReferanse, OverstyringUttak } from '.';

export interface OverstyrtUttakResponse {
  overstyringer: OverstyringUttak[];
  arbeidsgiverOversikt: { [key: string]: ArbeidsforholdReferanse };
}
