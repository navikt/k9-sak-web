import { Kodeverk } from '@k9-sak-web/types';

export interface Inntekt {
  fom: string;
  tom: string;
  utbetaler: string;
  inntektspostType: Kodeverk;
  belop: number;
  ytelse: boolean;
  navn: string;
}
