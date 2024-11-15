import { Arbeidstype } from '@k9-sak-web/behandling-pleiepenger';

export type OverstyringUttak = {
  id: string;
  periode: {
    fom: Date;
    tom: Date;
  };
  saksbehandler: string;
  søkersUttaksgrad: number;
  utbetalingsgrader: {
    arbeidsforhold: {
      type: Arbeidstype;
      orgnr: string | null;
      aktørId: string | null;
      arbeidsforholdId: string | null;
    };
    utbetalingsgrad: number;
  }[];
  begrunnelse: string;
};
